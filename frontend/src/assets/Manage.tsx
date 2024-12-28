import { useEffect, useState } from "react";
import axios from "axios"; // Adjust the path as necessary
import Modal from 'react-modal'; // Adjust the path as necessary or use the correct library
const url = "http://localhost:3000"

interface Team{
    teamId: number;
    teamName: string;
    members: string[];
}

interface Group {
    groupId: number;
    groupName: string;
    teams: number[];
}
function Manage() {
    const [userId, setUserId] = useState<number | null>(null);
    const [groupId, setGroupId] = useState<number | null>(null);
    const [groupMap, setGroupMap] = useState<Map<number, Group>>(new Map()); // [groupId, Group]
    const [teamMap, setTeamMap] = useState<Map<number, Team>>(new Map()); // [teamId, Team]
    const [chosenTeam, setChosenTeam] = useState<Map<number, boolean>>(new Map()); // [teamId, isChosenByGroup]
    const [chosenDeleteTeam, setChosenDeleteTeam] = useState<Map<number, boolean>>(new Map());
    const [chosenDeleteGroup, setChosenDeleteGroup] = useState<Map<number, boolean>>(new Map());
    const [showAddTeamModal, setShowAddTeamModal] = useState(false);
    const [showAddGroupModal, setShowAddGroupModal] = useState(false);
    const [showDeleteTeamModal, setShowDeleteTeamModal] = useState(false);
    const [showDeleteGroupModal, setShowDeleteGroupModal] = useState(false);
    const [teamName, setTeamName] = useState('');
    const [member1, setMember1] = useState('');
    const [member2, setMember2] = useState('');
    const [member3, setMember3] = useState('');
    const [groupName, setGroupName] = useState('');
    const [modifyGroupMessage, setModifyGroupMessage] = useState('');
    const [modalMessage, setModalMessage] = useState('');

    const fetchUserStatus = async () => {
        const response = await axios.get(url + "/auth/status", {
            withCredentials: true,
        });
        setUserId(response.data.userId);
    }
    const fetchGroupMap = async () => {
        const response = await axios.get(url + "/group", {
            withCredentials: true,
        });
        setGroupMap(new Map(response.data.map((group: Group) => [group.groupId, group])));
    }
    const fetchTeamMap = async () => {
        const response = await axios.get(url + "/team", {
            withCredentials: true,
        });
        setTeamMap(new Map(response.data.map((team: Team) => [team.teamId, team])));
    }
    const clearChosenTeam = async () => {
        if (!groupId) {
            return;
        }
        let newChosenTeam = chosenTeam;
        for (const teamId of teamMap.keys()) {
            newChosenTeam.set(teamId, false);
        }
        setChosenTeam(newChosenTeam);
    }

    const handleGroupUpdate = async () => {
        if (!userId){
            return;
        }
        if (!groupId){
            return;
        }
        const currentGroup = groupMap.get(groupId);
        if (!currentGroup){
            return;
        }
        let newTeams = [];
        for (const [teamId, isChosen] of chosenTeam){
            if (isChosen){
                newTeams.push(teamId);
            }
        }
        try{
            setModifyGroupMessage("updating group...");
            const response = await axios.patch(url + `/group/${groupId}`, {
                groupName: currentGroup.groupName,
                teams: newTeams,
            },{
                withCredentials: true
            });
            setModifyGroupMessage("Group updated successfully");
        } catch (error){
            if (axios.isAxiosError(error) && error.response?.status === 401){
                setModifyGroupMessage("You are not authorized to update this group");
            }
            else if (axios.isAxiosError(error) && error.response?.status === 400){
                setModifyGroupMessage("Invalid request");
            }
            else{
                setModifyGroupMessage("An error occurred");
            }
        }
        fetchGroupMap();
    }
    const handleAddTeam = async (event: React.FormEvent<HTMLFormElement>) => {
        if (!userId){
            return;
        }
        event.preventDefault();
        const form = event.currentTarget;
        if (!form){
            return;
        }
        try{
            setModalMessage("adding team...");
            const response = await axios.post(url + "/team", {
                teamName: teamName,
                members: [member1, member2, member3],
            },{
                withCredentials: true
            });
            setModalMessage("Team added successfully");
        } catch (error){
            if (axios.isAxiosError(error) && error.response?.status === 401){
                setModalMessage("You are not authorized to add a team");
            }
            else if (axios.isAxiosError(error) && error.response?.status === 400){
                setModalMessage("Invalid request");
            }
            else{
                setModalMessage("An error occurred");
            }
        }
        fetchTeamMap();
    }
    const handleAddGroup = async () => {
        if (!userId){
            return;
        }
        try{
            setModalMessage("adding group...");
            const response = await axios.post(url + "/group", {
                groupName: groupName,
                teams: [],
            },{
                withCredentials: true
            });
            setModalMessage("Group added successfully");
        } catch (error){
            if (axios.isAxiosError(error) && error.response?.status === 401){
                setModalMessage("You are not authorized to add a group");
            }
            else if (axios.isAxiosError(error) && error.response?.status === 400){
                setModalMessage("Invalid request");
            }
            else{
                setModalMessage("An error occurred");
            }
        }
        fetchGroupMap();
    }
    const handleDeleteTeam = async () => {
        if (!userId){
            return;
        }
        try{
            setModalMessage("deleting team...");
            for (const teamId of teamMap.keys()){
                if (chosenDeleteTeam.get(teamId)){
                    const response = await axios.delete(url + `/team/${teamId}`, {
                        withCredentials: true
                    });
                }
            }
            setModalMessage("Team deleted successfully");
        } catch (error){
            if (axios.isAxiosError(error) && error.response?.status === 401){
                setModalMessage("You are not authorized to delete a team");
            }
            else if (axios.isAxiosError(error) && error.response?.status === 400){
                setModalMessage("Invalid request");
            }
            else{
                setModalMessage("An error occurred");
            }
        }
        fetchTeamMap();
    }
    const handleDeleteGroup = async () => {
        if (!userId){
            return;
        }
        try{
            setModalMessage("deleting group...");
            for (const groupId of groupMap.keys()){
                if (chosenDeleteGroup.get(groupId)){
                    const response = await axios.delete(url + `/group/${groupId}`, {
                        withCredentials: true
                    });
                }
            }
            setModalMessage("Group deleted successfully");
        } catch (error){
            if (axios.isAxiosError(error) && error.response?.status === 401){
                setModalMessage("You are not authorized to delete a group");
            }
            else if (axios.isAxiosError(error) && error.response?.status === 400){
                setModalMessage("Invalid request");
            }
            else{
                setModalMessage("An error occurred");
            }
        }
        fetchGroupMap();
    }


    useEffect(() => {
        fetchUserStatus();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchGroupMap();
            fetchTeamMap();
        }
    }, [userId]);

    return (
        <div>
        <h1>Manage</h1>
        <h2>Group List</h2>
        <h2>Group Dropdown {groupId}</h2>
        <select
            value={groupId ?? ""}
            onChange={(e) => {
            setGroupId(parseInt(e.target.value));
            }}
        >
            <option value="">Select a group</option>
            {Array.from(groupMap.values()).map((group) => (
            <option key={group.groupId} value={group.groupId}>
                {group.groupName}
            </option>
            ))}
        </select>
        <h2>Team List</h2>
        <ul>
            {Array.from(teamMap.values()).map((team) => (
            <li key={team.teamId}>
                <input
                type="checkbox"
                checked={chosenTeam.get(team.teamId) ?? false}
                onChange={() => {
                    let newChosenTeam = new Map(chosenTeam);
                    newChosenTeam.set(team.teamId, !chosenTeam.get(team.teamId));
                    setChosenTeam(newChosenTeam);
                }}
                />
                {team.teamName}
            </li>
            ))}
        </ul>
        <h3>{modifyGroupMessage}</h3>
        <button onClick={() => {handleGroupUpdate(); clearChosenTeam();}}> Submit </button>
        <button onClick={() => setShowAddTeamModal(true)}> Add team </button>
        <button onClick={() => setShowAddGroupModal(true)}> Add group </button>
        <button onClick={() => setShowDeleteTeamModal(true)}> Delete team </button>
        <button onClick={() => setShowDeleteGroupModal(true)}> Delete group </button>
        <Modal isOpen={showAddTeamModal}>
            <div>
            <form onSubmit={handleAddTeam}>
                <label>
                Team Name:
                <input 
                    type="text"
                    name="teamName"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                 />
                </label>
                <label>
                Member1:
                <input
                    type="text"
                    name="member1"
                    value={member1}
                    onChange={(e) => setMember1(e.target.value)}
                />
                </label>
                <label>
                Member2:
                <input
                    type="text"
                    name="member2"
                    value={member2}
                    onChange={(e) => setMember2(e.target.value)}
                />
                </label>
                <label>
                Member3:
                <input
                    type="text"
                    name="member3"
                    value={member3}
                    onChange={(e) => setMember3(e.target.value)}
                />
                </label>
                <button type="submit">Add</button>
            </form>
            <h3>{modalMessage}</h3>
            <button onClick={() => { setShowAddTeamModal(false); setModalMessage(''); }}>Close</button>
            </div>
        </Modal>
        <Modal isOpen={showAddGroupModal}>
            <div>
            <form onSubmit={handleAddGroup}>
                <label>
                Group Name:
                <input
                    type="text"
                    name="groupName"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                />
                </label>
                <button type="submit">Add</button>
            </form>
            <h3>{modalMessage}</h3>
            <button onClick={() => {setShowAddGroupModal(false); setModalMessage('')}}>Close</button>
            </div>
        </Modal>
        <Modal isOpen={showDeleteTeamModal}>
            <div>
                <ul>
                {Array.from(teamMap.values()).map((team) => (
                    <li key={team.teamId}>
                        <input
                        type="checkbox"
                        checked={chosenDeleteTeam.get(team.teamId) ?? false}
                        onChange={() => {
                            let newChosenTeam = new Map(chosenDeleteTeam);
                            newChosenTeam.set(team.teamId, !chosenDeleteTeam.get(team.teamId));
                            setChosenDeleteTeam(newChosenTeam);
                        }}
                        />
                        {team.teamName}
                    </li>
                ))}
                </ul>
                <h3>{modalMessage}</h3>
                <button onClick={() => {handleDeleteTeam(); setModalMessage('')}}> Delete </button>
                <button onClick={() => setShowDeleteTeamModal(false)}> Close </button>
            </div>
        </Modal>
        <Modal isOpen={showDeleteGroupModal}>
            <div>
                <ul>
                {Array.from(groupMap.values()).map((group) => (
                    <li key={group.groupId}>
                        <input
                        type="checkbox"
                        checked={chosenDeleteGroup.get(group.groupId) ?? false}
                        onChange={() => {
                            let newChosenGroup = new Map(chosenDeleteGroup);
                            newChosenGroup.set(group.groupId, !chosenDeleteGroup.get(group.groupId));
                            setChosenDeleteGroup(newChosenGroup);
                        }}
                        />
                        {group.groupName}
                    </li>
                ))}
                </ul>
                <h3>{modalMessage}</h3>
                <button onClick={() => {handleDeleteGroup(); setModalMessage('')}}> Delete </button>
                <button onClick={() => setShowDeleteGroupModal(false)}> Close </button>
            </div>
        </Modal>
        </div>
    );
}
export default Manage;