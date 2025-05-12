import React, { useState } from "react";
import { Input, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const SearchBar = ({ setCenter, onSearch, onClear }) => {
  const [address, setAddress] = useState("");

  const handleSelect = async (selectedAddress) => {
    setAddress(selectedAddress);

    try {
      const results = await geocodeByAddress(selectedAddress);
      const { lat, lng } = await getLatLng(results[0]);

      const location = {
        address: selectedAddress,
        lat,
        lng,
      };

      setCenter(location);
      onSearch(location);
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };

  const handleClear = () => {
    setAddress("");
    onClear();
  };

  return (
    <div style={{ position: "absolute", top: 10, left: 10, zIndex: 1000, width: "320px", display: "flex" , height: "40px"}}>
      <PlacesAutocomplete value={address} onChange={setAddress} onSelect={handleSelect}>
        {({ getInputProps, suggestions, getSuggestionItemProps }) => (
          <div style={{ flex: 1 }}>
            <Input
              style={{
                width: "100%",
                height: "40px",
                 paddingRight: "40px"
              }}
              {...getInputProps({
                placeholder: "Search for a location...",
              })}
             
            />

            {address && (
              <Button
                icon={<CloseOutlined />}
                size="small"
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "4px",
                  backgroundColor: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={handleClear}
              />
            )}

            <div style={{ background: "#fff", boxShadow: "0px 2px 4px rgba(0,0,0,0.1)" }}>
              {suggestions.map((suggestion) => {
                const style = {
                  padding: "10px",
                  cursor: "pointer",
                  backgroundColor: suggestion.active ? "#ddd" : "#fff",
                };
                return (
                  <div
                    {...getSuggestionItemProps(suggestion, { style })}
                    key={suggestion.placeId}
                  >
                    {suggestion.description}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default SearchBar;
