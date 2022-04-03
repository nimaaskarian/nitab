import geocoding from "apis/geocoding";
import {
  Button,
  DeleteButton,
  Header,
  TwoConditionElement,
} from "components/SideMenu/components/styled";
import TextInput from "components/SideMenu/components/TextInput";
import { nanoid } from "nanoid";
import React, { useEffect, useMemo, useState } from "react";
import "flag-icons/css/flag-icons.css";
import {
  AddedCitiesWrapper,
  CityWrapper,
  IconWrapper,
  ResultWrapper,
} from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  addWeatherCity,
  deleteWeatherCity,
  setWeatherIndex,
  setWeatherIsAutomatic,
} from "store/actions";

const Weather = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState([]);
  const dispatch = useDispatch();
  const cities = useSelector(({ data }) => data.weather.cities);
  const currentCityIndex = useSelector(({ data }) => data.weather.index);
  const isAutomatic = useSelector(({ data }) => data.weather.isAutomatic);
  const citiesWithKeys = useMemo(
    () => cities.map((city) => ({ ...city, key: nanoid() })),
    [cities]
  );
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm)
        return geocoding
          .get("/search", { params: { name: searchTerm } })
          .then((res) => res.data?.results)
          .then((results) =>
            setItems(
              results
                ? results.map((result) => ({ ...result, key: nanoid() }))
                : null
            )
          );
      return setItems([]);
    }, 200);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchTerm]);
  return (
    <div>
      <Header>Settings</Header>
      <label>Automatic Weather</label>
      <input
        type="checkbox"
        checked={isAutomatic}
        onChange={(e) => dispatch(setWeatherIsAutomatic(e.target.checked))}
      />
      <AddedCitiesWrapper>
        {citiesWithKeys.map((city, index) => {
          const selected = index === currentCityIndex;
          return (
            <TwoConditionElement key={city.key} enabled={selected}>
              <div>
                <IconWrapper className={`fi fis fi-${city.iconCode}`} />
                <span>{city.name}</span>
              </div>
              <div>
                <Button
                  onClick={() => {
                    dispatch(setWeatherIndex(index));
                  }}
                >
                  {selected ? "Selected" : "Select"}
                </Button>
                <DeleteButton
                  onClick={() => dispatch(deleteWeatherCity(index))}
                  className="fa fa-trash"
                />
              </div>
            </TwoConditionElement>
          );
        })}
      </AddedCitiesWrapper>
      <Header>Add a City</Header>
      <TextInput
        onChange={setSearchTerm}
        value={searchTerm}
        label="Search City"
      />
      {!items ? (
        <div>No Results found :(</div>
      ) : (
        items.map((item) => {
          const iconCode = item.country_code.toLowerCase();
          return (
            <ResultWrapper key={item.key}>
              <CityWrapper>
                <IconWrapper className={`fi fis fi-${iconCode}`} />
                <span>
                  {item.country && item.country + "/"}
                  {item.name}
                </span>
              </CityWrapper>
              <div>
                <Button
                  onClick={() =>
                    dispatch(
                      addWeatherCity({
                        lat: item.latitude,
                        lon: item.longitude,
                        name: item.name,
                        iconCode,
                      })
                    )
                  }
                >
                  Add
                </Button>
              </div>
            </ResultWrapper>
          );
        })
      )}
    </div>
  );
};

export default Weather;
