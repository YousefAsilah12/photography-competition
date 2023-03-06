import { useFirestore } from "../../../services/competition";
import { useEffect, useState } from "react";
import "./CompetitionDisplay.css";
import { useNavigate } from 'react-router-dom';
import { extractDateTime } from "../../../services/date";
import { ImageComponent } from "../imageComponent/Imgage";
export const CompetitionsDisplay = (props) => {
  const { data: competition, isLoading, error, updateDocument, deleteDocument, fetchData } = useFirestore();
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
      await updateDocument(selectedCompetition.id, selectedCompetition);
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
    return <div>Loading...</div>;
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
  return (
    <div className="competitions-display">
      <button onClick={() => { navigate("/create-competition") }}>add competition</button>
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
                  value={Date(selectedCompetition.startDate).toString()}
                  onChange={(e) =>
                    setSelectedCompetition({
                      ...selectedCompetition,
                      startDate: e.target.value,
                    })
                  }
                />
                <input
                  type="date"
                  value={Date(selectedCompetition.finishDate).toString()}
                  onChange={(e) =>
                    setSelectedCompetition({
                      ...selectedCompetition,
                      finishDate: e.target.value,
                    })
                  }
                />
              </div>
              <input placeholder="image url" value={selectedCompetition.image} onChange={(e) =>
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
                <button className="editButton" onClick={() => handleEdit(comp)}>Edit</button>
                <button className="deleteButton" onClick={() => handledelete(comp.id)}>delete</button>
                <button onClick={() => { handleJoin(comp.id) }}>join</button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
};
