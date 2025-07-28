import React, { useState } from "react";
import "./App.css";

function App() {
  const [people, setPeople] = useState({});
  const [events, setEvents] = useState("");
  const [output, setOutput] = useState("");

  class Person {
    constructor(firstname, familyname, birthfamilyname, gender, fathername, spousename, age) {
      this.firstname = firstname;
      this.familyname = familyname;
      this.birthfamilyname = birthfamilyname;
      this.gender = gender;
      this.fathername = fathername;
      this.spousename = spousename;
      this.age = parseInt(age);
      this.leadername = firstname;
    }
  }

  const handleAddPeople = (input) => {
    const lines = input.trim().split("\n");
    const newPeople = {};
    for (const line of lines) {
      const data = line.trim().split(" ");
      const p = new Person(...data);
      newPeople[p.firstname] = p;
    }
    setPeople(newPeople);
  };

  const chooseLeader = (familyname, peopleMap) => {
    const members = Object.values(peopleMap).filter(p => p.familyname === familyname && p.age > 0);
    if (members.length === 0) return;
    members.sort((a, b) => b.age - a.age || a.firstname.localeCompare(b.firstname));
    const leader = members[0].firstname;
    members.forEach(m => m.leadername = leader);
  };

  const processEvents = () => {
    const lines = events.trim().split("\n");
    const updatedPeople = { ...people };

    const getPerson = (name) => updatedPeople[name];

    const outputLines = [];

    for (const line of lines) {
      const parts = line.trim().split(" ");
      const event = parts[0];

      if (event === "PA") {
        const alive = Object.values(updatedPeople).filter(p => p.age > 0);
        alive.sort((a, b) => a.firstname.localeCompare(b.firstname));
        alive.forEach(p => {
          outputLines.push(`${p.firstname} ${p.familyname} ${p.birthfamilyname} ${p.gender} ${p.fathername} ${p.spousename} ${p.age} ${p.leadername}`);
        });
      } else if (event === "PO") {
        const p = getPerson(parts[1]);
        outputLines.push(`${p.firstname} ${p.familyname} ${p.birthfamilyname} ${p.gender} ${p.fathername} ${p.spousename} ${p.age} ${p.leadername}`);
      } else if (event === "MA") {
        const [p1, p2] = [parts[1], parts[2]];
        getPerson(p1).spousename = p2;
        getPerson(p2).spousename = p1;
        chooseLeader(getPerson(p1).familyname, updatedPeople);
        chooseLeader(getPerson(p2).familyname, updatedPeople);
      } else if (event === "DI") {
        const [p1, p2] = [parts[1], parts[2]];
        getPerson(p1).spousename = "NA";
        getPerson(p2).spousename = "NA";
        chooseLeader(getPerson(p1).familyname, updatedPeople);
        chooseLeader(getPerson(p2).familyname, updatedPeople);
      } else if (event === "BI") {
        const [name, gender, father, mother] = parts.slice(1);
        const p = getPerson(name);
        p.gender = gender;
        p.fathername = father;
        p.familyname = getPerson(father).familyname;
        p.birthfamilyname = p.familyname;
        p.spousename = "NA";
        chooseLeader(p.familyname, updatedPeople);
      } else if (event === "DE") {
        const name = parts[1];
        getPerson(name).age = -1;
        chooseLeader(getPerson(name).familyname, updatedPeople);
      } else if (event === "YP") {
        const years = parseInt(parts[1]);
        Object.values(updatedPeople).forEach(p => {
          if (p.age > 0) p.age += years;
        });
      }
    }
    setOutput(outputLines.join("\n"));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      <h1 className="text-3xl font-bold text-center">Family Tree Simulation</h1>

      <div>
        <label className="block font-semibold">Enter People (one per line):</label>
        <textarea
          className="w-full h-40 border p-2 mt-1 rounded"
          placeholder="Firstname Familyname BirthFamilyname Gender Fathername Spousename Age"
          onBlur={(e) => handleAddPeople(e.target.value)}
        ></textarea>
      </div>

      <div>
        <label className="block font-semibold">Enter Events (one per line):</label>
        <textarea
          className="w-full h-40 border p-2 mt-1 rounded"
          placeholder="Events like: PA, MA Rob Arya, DE Ned, etc."
          value={events}
          onChange={(e) => setEvents(e.target.value)}
        ></textarea>
      </div>

      <button
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow"
        onClick={processEvents}
      >
        Process Events
      </button>

      <div>
        <label className="block font-semibold mt-4">Output:</label>
        <textarea className="w-full h-60 border p-2 mt-1 rounded" value={output} readOnly></textarea>
      </div>
    </div>
  );
}

export default App;
