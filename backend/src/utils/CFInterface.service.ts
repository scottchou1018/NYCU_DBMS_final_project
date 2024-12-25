import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { DatabaseService } from 'src/database/database.service';
import bottleneck from 'bottleneck';
import { constrainedMemory } from 'process';
import { last } from 'rxjs';

const API_BASE_URL = 'https://codeforces.com/api';
const BLOCK_SIZE = 50;

interface ApiResponse<T> {
    status: string;
    result: T;
}

@Injectable()
export class CFInterface{
    constructor(
        private readonly databaseService: DatabaseService
    ) {}

    private executable: boolean = true;
    
    async checkHandleExist(handle: string) {
        const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/user.info?handles=${handle}`);
        return response.data.status === 'OK';
    }

    async getHandleSubmission(teamId: number, handle: string, lastSubmissionId: number) {
        if (lastSubmissionId === 0){
            const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/user.status?handle=${handle}`);
            const cfuser = await this.databaseService.cFuser.findFirst({
                where: { 
                    handle: handle,
                    teamId: teamId
                },
            });
            await this.databaseService.cFuser.update({
                where: { CFuserId: cfuser.CFuserId },
                data: { lastSubmissionId: response.data.result[0].id }
            });
            return response.data.result;
        }
        for (let blockSize = BLOCK_SIZE; ; blockSize += BLOCK_SIZE){
            const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/user.status?handle=${handle}&count=${blockSize}`);
            const submissions = response.data.result;
            if (submissions[submissions.length - 1].id <= lastSubmissionId){
                while(submissions.length > 0 && submissions[submissions.length - 1].id <= lastSubmissionId){
                    submissions.pop();
                }
                if (submissions.length === 0){
                    return [];
                }
                const cfuser = await this.databaseService.cFuser.findFirst({
                    where: { 
                        handle: handle,
                        teamId: teamId
                    },
                });
                await this.databaseService.cFuser.update({
                    where: { CFuserId: cfuser.CFuserId },
                    data: { lastSubmissionId: submissions[0].id }
                });
                return submissions;
            }
        }
    }

    async updateTeamSubmission(teamId: number) {
        while (!this.executable){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        this.executable = false;
        const users = await this.databaseService.cFuser.findMany({
            where: { teamId: teamId }
        });
        const submissionArray = [];
        const submissionPointer = [];
        for (let user of users) {
            submissionPointer.push(0);
            const submissions = await this.getHandleSubmission(teamId, user.handle, user.lastSubmissionId);
            const reversedSubmissions = submissions.reverse();
            submissionArray.push(reversedSubmissions);
        }
        while (true) {
            const minSubmission = { id: 2e9, index: -1 };
            let ok = true;
            for (let i = 0; i < submissionArray.length; i++) {
                if (submissionPointer[i] >= submissionArray[i].length) {
                    ok = false;
                }
            }
            if (!ok){
                break;
            }
            for (let i = 0; i < submissionArray.length; i++) {
                if (submissionArray[i][submissionPointer[i]].id < minSubmission.id) {
                    minSubmission.id = submissionArray[i][submissionPointer[i]].id;
                    minSubmission.index = i;
                }
            }
            let allSame = true;
            for (let i = 0; i < submissionArray.length; i++) {
                if (submissionArray[i][submissionPointer[i]].id !== minSubmission.id) {
                    allSame = false;
                    break;
                }
            }
            if (allSame) {
                const contestId = submissionArray[0][submissionPointer[0]].contestId;
                const existContest = await this.databaseService.contest.findUnique({
                    where: { contestId: contestId }
                });
                if (existContest === null) {
                    let problemIndices = "";
                    const response = await axios.get<ApiResponse<any>>(`${API_BASE_URL}/contest.standings?contestId=${contestId}`);
                    for (let i = 0; i < response.data.result.problems.length; i++) {
                        problemIndices += response.data.result.problems[i].index;
                    }
                    const contestName = response.data.result.contest.name;
                    await this.databaseService.contest.create({
                        data: {
                            contestId: contestId,
                            contestName: contestName,
                            problemCount: response.data.result.problems.length,
                            problemIndices: problemIndices
                        }
                    });
                }
                const participation = await this.databaseService.participation.findUnique({
                    where: { teamId_contestId: { teamId: teamId, contestId: contestId } }
                });
                if (participation === null) {
                    await this.databaseService.participation.create({
                        data: {
                            teamId: teamId,
                            contestId: contestId,
                            ACcount: 0,
                            totalPenalty: 0
                        }
                    });
                }
                await this.updateProblemResult(teamId, contestId, submissionArray[0][submissionPointer[0]]);
                for (let i = 0; i < submissionArray.length; i++) {
                    submissionPointer[i]++;
                }
            }
            else {
                submissionPointer[minSubmission.index]++;
            }
        }
        this.executable = true;
    }

    async updateProblemResult(teamId: number, contestId: number, submission: any) {
        if (submission.verdict === 'TESTING' || submission.verdict === 'REJECTED' || submission.verdict === 'SKIPPED' || submission.verdict === 'COMPILATION_ERROR') {
            return;
        }
        const existProblemResult = await this.databaseService.problemResult.findFirst({
            where: {
                teamId: teamId,
                contestId: contestId,
                problemIndex: submission.problem.index
            }
        });
        if (existProblemResult !== null) {
            if (existProblemResult.status === 'OK') {
                return;
            }
            const penalty = (submission.verdict === 'OK') ? submission.relativeTimeSeconds / 60 + existProblemResult.triesCount * 20 : 0;
            const status = submission.verdict;
            const triesCount = existProblemResult.triesCount + (submission.verdict === 'OK' ? 0 : 1);
            await this.databaseService.problemResult.update({
                where: {
                    resultId: existProblemResult.resultId
                },
                data: {
                    status: status,
                    penalty: penalty,
                    triesCount: triesCount
                }
            });
            const participation = await this.databaseService.participation.findUnique({
                where: { teamId_contestId: { teamId: teamId, contestId: contestId } }
            });
            await this.databaseService.participation.update({
                where: {
                    teamId_contestId: { teamId: teamId, contestId: contestId }
                },
                data: {
                    ACcount: (status === 'OK') ? participation.ACcount + 1 : participation.ACcount,
                    totalPenalty: participation.totalPenalty + penalty
                }
            });
        }
        else{
            const penalty = (submission.verdict === 'OK') ? submission.relativeTimeSeconds / 60 : 0;
            const status = submission.verdict;
            await this.databaseService.problemResult.create({
                data: {
                    teamId: teamId,
                    contestId: contestId,
                    problemName: submission.problem.name,
                    problemIndex: submission.problem.index,
                    status: status,
                    penalty: penalty,
                    triesCount: (status === 'OK') ? 0 : 1
                }
            });
            const participation = await this.databaseService.participation.findUnique({
                where: { teamId_contestId: { teamId: teamId, contestId: contestId } }
            });
            await this.databaseService.participation.update({
                where: {
                    teamId_contestId: { teamId: teamId, contestId: contestId }
                },
                data: {
                    ACcount: (status === 'OK') ? participation.ACcount + 1 : participation.ACcount,
                    totalPenalty: participation.totalPenalty + penalty
                }
            });
        }
    }
}