import { useFirestore } from "../../../services/competition";
import { useEffect, useState } from "react";
import "./CompetitionDisplay.css";
import { useNavigate } from 'react-router-dom';
import { extractDateTime } from "../../../services/date";
import { ImageComponent } from "../imageComponent/Imgage";
export const CompetitionsDisplay = (props) => {
  const { data: competition, isLoading, error, updateDocument, deleteDocument, fetchData, getUserByEmail, userData } = useFirestore();
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();
  const [selectedCompetition, setSelectedCompetition] = useState({
    id: "",
    title: "",
    description: "",
    startDate: "",
    finishDate: "",
    image: ""
  });
  useEffect(() => {
    fetchData("competition");
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      getUserByEmail(user.email)
    }
  }, [])

  const handleEdit = (competition) => {
    setIsEditing(true);
    setSelectedCompetition(competition);
  };

  const handleSave = async () => {
    setIsEditing(false);
    setSelectedCompetition(null);
    // TODO: save changes to the database
    try {
      await updateDocument(selectedCompetition.id, selectedCompetition, "competition");
      console.log("updated");
    } catch (e) {
      console.log(e.message);
    }
  };
  const handledelete = async (id) => {
    try {
      await deleteDocument(id, "competition")
    } catch (e) {
      alert(e.message);
    }

  }

  if (isLoading) {
    return <div className="loading-center">
        <h1>Loading...</h1>

    </div>

  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }


  function dateToString(date) {
    const time = extractDateTime(date)
    return time.date
  }
  function handleJoin(id) {
    const userLocalstorage = JSON.parse(localStorage.getItem("user"));
    if (!userLocalstorage) {
      const confirm = window.confirm("You must be logged in to join a competition");
      if (confirm) {
        navigate("/login");
        return
      }
      else {
        window.close();
        return
      }
    }

    navigate(`/competition-gallery/${id}`)

  }
  return (<div className="competitionPageLayout">
    <div>
      {(userData[0] && userData[0].rule === "admin") && <button onClick={() => { navigate("/create-competition") }} className="addCopetitionButton">add competition</button>}
    </div>
    <div className="competitions-display">
      {competition.map((comp) => (
        <div className="competition-card" key={comp.id}>
          {isEditing && selectedCompetition?.id === comp.id ? (
            <>
              <input
                type="text"
                value={selectedCompetition.title}
                onChange={(e) =>
                  setSelectedCompetition({
                    ...selectedCompetition,
                    title: e.target.value,
                  })
                }
              />
              <textarea
                value={selectedCompetition.description}
                onChange={(e) =>
                  setSelectedCompetition({
                    ...selectedCompetition,
                    description: e.target.value,
                  })
                }
              ></textarea>
              <div className="dates">
                <input
                  type="date"
                  value={selectedCompetition.startDate ? new Date(selectedCompetition.startDate).toISOString().substr(0, 10) : ''}
                  onChange={(e) =>
                    setSelectedCompetition({
                      ...selectedCompetition,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  value={selectedCompetition.startDate ? new Date(selectedCompetition.finishDate).toISOString().substr(0, 10) : ''}
                  onChange={(e) =>
                    setSelectedCompetition({
                      ...selectedCompetition,
                      finishDate: e.target.value,
                    })
                  }
                />
              </div>
              <input placeholder="image url" value={selectedCompetition.imageUrl} onChange={(e) =>
                setSelectedCompetition({
                  ...selectedCompetition,
                  image: e.target.value,
                })} />
              <div className="compBottombuttons">
                <button onClick={() => setIsEditing(false)}>Cancel</button>
                <button onClick={handleSave}>Save</button>

              </div>
            </>
          ) : (
            <>
              <ImageComponent location="competitionImages" imageName={comp.imageUrl}></ImageComponent>
              <h2>{comp.title}</h2>
              <p>{comp.description}</p>
              <div className="dates">
                <p>Start Date: {dateToString(comp.startDate)}</p>
                <p>Finish Date: {dateToString(comp.finishDate)}</p>
              </div>
              <div className="compBottombuttons">
                <div>

                  {(userData[0] && userData[0].rule === "admin") && <button className="editButton" onClick={() => handleEdit(comp)}>Edit</button>}
                </div>
                <div>
                  {(userData[0] && userData[0].rule === "admin") && <button className="deleteButton" onClick={() => handledelete(comp.id)}>delete</button>}
                </div>
                <div>
                  <button onClick={() => { handleJoin(comp.id) }}>join</button>
                </div>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  </div>
  );
};
