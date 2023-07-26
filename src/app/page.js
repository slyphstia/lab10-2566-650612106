"use client";

import { UserCard } from "@/components/UserCard";
import { cleanUser } from "@/libs/cleanUser";
import axios from "axios";
import { useEffect, useState } from "react";

export default function RandomUserPage() {
  //user = null or array of object
  const [users, setUsers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [genAmount, setGenAmount] = useState(1);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  

  const generateBtnOnClick = async () => {
    setIsLoading(true);
    const resp = await axios.get(
      `https://randomuser.me/api/?results=${genAmount}`
    );
    setIsLoading(false);
    const users = resp.data.results;
    //Your code here
    //Process result from api response with map function. Tips use function from /src/libs/cleanUser
    //Then update state with function : setUsers(...)
    const cleanedUser = [];
    for (let i = 0; i < users.length; i++) {
      cleanedUser[i] = cleanUser(users[i]);
    }
    const newusered = [...cleanedUser];
    setUsers(newusered);
  };

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    const strGenAmount = JSON.stringify(genAmount);
    localStorage.setItem("genAmount", strGenAmount);
  }, [genAmount]);

  useEffect(() => {
    const strGenAmount = localStorage.getItem("genAmount");
    if (strGenAmount === null) {
      setGenAmount(1);
      return;
    }
    
    const loadedGenAmount = JSON.parse(strGenAmount);
    setGenAmount(loadedGenAmount);
  }, []);

  return (
    <div style={{ maxWidth: "700px" }} className="mx-auto">
      <p className="display-4 text-center fst-italic m-4">Users Generator</p>
      <div className="d-flex justify-content-center align-items-center fs-5 gap-2">
        Number of User(s)
        <input 
          className="form-control text-center"
          style={{ maxWidth: "100px" }}
          type="number"
          onChange={(e) => setGenAmount(e.target.value)}
          value={genAmount}
        />
        <button className="btn btn-dark" onClick={generateBtnOnClick}>
          Generate
        </button>
      </div>
      {isLoading && (
        <p className="display-6 text-center fst-italic my-4">Loading ...</p>
      )}
      {users &&
        !isLoading &&
        users.map((x) => (
          <UserCard
            name={x.name}
            imgUrl={x.imgUrl}
            address={x.address}
            email={x.email}
            key={x.key}
          />
        ))}
    </div>
  );
}