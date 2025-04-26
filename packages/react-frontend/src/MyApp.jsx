import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
    const [characters, setCharacters] = useState([]);

    function fetchUsers() {
        const promise = fetch("http://localhost:8000/users");
        return promise;
    }

    useEffect(() => {
        fetchUsers()
            .then((res) => res.json())
            .then((json) => setCharacters(json["users_list"]))
            .catch((error) => {
                console.log(error);
            })
    }, []);

    function postUser(person) {
        const promise = fetch("http://localhost:8000/users", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(person)
        });

        return promise;
    }

    function removeOneCharacter(index) {
        const userToDelete = characters[index];
        const userID = userToDelete._id;

        fetch(`http://localhost:8000/users/${userID}`, { method: "DELETE" })
          .then((res) => {
            if (res.status === 204) {
              const updated = characters.filter((character, i) => i !== index);
              setCharacters(updated);
            } else if (res.status === 404) {
              console.log("Error 404: User Not Found");
            } else {
              console.log("Unexpected error during delete");
            }
          })
          .catch((error) => {
            console.log("Error deleting user: ", error);
          });
    };

    function updateList(person) {
        postUser(person)
            .then((res) => {
                if (res.status === 201) {
                    return res.json()
                }
            })
            .then((characterJSON) => setCharacters([...characters, characterJSON]))
            .catch((error) => {
                console.log(error);
            });
    }

    return (
        <div className="container">
            <Table 
                characterData={characters}
                removeCharacter={removeOneCharacter}
            />
            <Form handleSubmit={updateList} />
        </div>
    );
}

export default MyApp;