import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Api({ name }) {
  const [data, setData] = useState([]);
  const [searchdata, setSearchdata] = useState(""); // Input value
  const [query, setQuery] = useState(""); // Debounced value
  const [electronic, setElectronic] = useState(false);
  const [suggestion, setSuggestion] = useState([]);

  useEffect(() => {
    async function fetching() {
      try {
        let res = await axios.get("https://fakestoreapi.com/products");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    }
    fetching();
  }, []);

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(searchdata);
    }, 1000); // 1-second delay

    return () => clearTimeout(timer);
  }, [searchdata]); // Listen for changes in searchdata

  // Update suggestions as user types
  useEffect(() => {
    if (searchdata.length > 0) {
      let filteredData = data
        .filter((e) => e.title.toLowerCase().includes(searchdata.toLowerCase()))
        .slice(0, 5);
      setSuggestion(filteredData);
    } else {
      setSuggestion([]);
    }
  }, [searchdata, data]);

  // Filter function
  function filter() {
    let filtered = data.filter((e) =>
      e.title.toLowerCase().includes(query.toLowerCase())
    );
    if (electronic) {
      filtered = filtered.filter((e) => e.category === "electronics");
    }
    return filtered;
  }

  return (
    <>
      <div> This is my e-commerce {name} </div>

      <div style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search here"
          value={searchdata}
          onChange={(e) => setSearchdata(e.target.value)}
        />

        {suggestion.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              backgroundColor: "white",
              border: "1px solid #ccc",
              listStyleType: "none",
              padding: 0,
              margin: 0,
              zIndex: 10,
            }}
          >
            {suggestion.map((item) => (
              <li
                key={item.id}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                  borderBottom: "1px solid #ddd",
                }}
                onClick={() => setSearchdata(item.title)}
              >
                {item.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      <button onClick={() => setElectronic(!electronic)}> Electronics </button>

      <ul>
        {filter().length > 0 ? (
          filter().map((e) => (
            <li key={e.id}>
              {e.title}
              <br />
              <img src={e.image} alt="" style={{ width: "100px" }} />
            </li>
          ))
        ) : (
          <li>No results</li>
        )}
      </ul>
    </>
  );
}
