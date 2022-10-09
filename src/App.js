import './App.css';
import * as React from 'react';

import {
  Autocomplete,
  TextField,
  Select,
  MenuItem,
  OutlinedInput,
  InputLabel,
  FormControl,
  LinearProgress,
  Button,
} from "@mui/material";

// import { LoadingButton } from '@mui/lab';

import {
  getBrands,
  getBrandVehicles,
  getVehicleYears,
  searchMany,
} from "./utils/requests";
import { useEffect, useState } from "react";

import LineChart  from "./components/charts/LineChart";

function App() {

  const [ brands, setBrands ] = useState([]);
  const [ vehicles, setVehicles ] = useState([]);
  const [ vehicleYears, setVehicleYears ] = useState([]);

  const [ selectedBrand, setSelectedBrand ] = useState(null);
  const [ selectedVehicle, setSelectedVehicle ] = useState(null);
  const [ selectedVehicleYear, setSelectedVehicleYear ] = useState('');

  const [ chartData, setChartData ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);

  useEffect(() => {
    getBrands().then((brands) => {
      setBrands(brands.map(b => {
        return { ...b, id: b.id, label: b.Marca }
      }))
    })
  }, []);

  useEffect(() => {
    if (!selectedBrand) return;

    setSelectedVehicle(null);
    setSelectedVehicleYear(null);
    setVehicles([]);
    setVehicleYears([]);

    getBrandVehicles({ brandId: selectedBrand?.IdMarca }).then((vehicles) => {
      setVehicles(vehicles.map(v => {
        return { ...v, id: v.IdModelo, label: v.Modelo }
      }))
    })
  }, [selectedBrand]);

  useEffect(() => {
    if (!selectedVehicle) return;

    setSelectedVehicleYear(null);

    getVehicleYears({ vehicleId: selectedVehicle?.id }).then((years) => {
      console.log({ years })
      setVehicleYears(years.map(y => {
        return { ...y, id: y.IdAno, label: y.Ano }
      }))
    })
  }, [selectedVehicle]);

  const handleSearch = async () => {
    setIsLoading(true);
    console.log({ selectedBrand, selectedVehicle, selectedVehicleYear })
    const res = await searchMany({
      codigoMarca: selectedBrand.IdMarca,
      codigoModelo: selectedVehicle.IdModelo,
      anoModelo: selectedVehicleYear.Ano,
    })
    console.log({ res })
    setIsLoading(false);
    setChartData(res)
  }
  return (
    <div className="App h-screen max-w-full">
      <div className="flex flex-col mt-10">
        { isLoading && <LinearProgress /> }
        <section className="flex m-auto flex-wrap mt-2">
        <div>
          <Autocomplete
            disablePortal
            options={brands}
            sx={{ width: 200 }}
            onChange={(e, brand) => setSelectedBrand(brand)}
            renderInput={(params) => <TextField {...params} label="Marcas" />}
          />
        </div>
        <div>
          <Autocomplete
            disablePortal
            disabled={!selectedBrand}
            options={vehicles}
            sx={{ width: 500 }}
            onChange={(e, vehicle) => setSelectedVehicle(vehicle)}
            renderInput={(params) => <TextField {...params} label="Veiculos" />}
          />
        </div>
        <div>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-autowidth-label">Ano</InputLabel>
            <Select
              disabled={!selectedVehicle}
              value={selectedVehicleYear}
              onChange={(e) => { setSelectedVehicleYear(e.target.value) }}
              input={<OutlinedInput label="Name" />}
            >
              {vehicleYears?.map((year) => <MenuItem key={year.ano} value={year}>{year.Ano}</MenuItem>)}
            </Select>
          </FormControl>
        </div>
        <div className="w-6">
            <Button disabled={!selectedVehicleYear} variant="contained" loading={isLoading} onClick={handleSearch}>Pesquisar</Button>
        </div>
      </section>
        <section className="h-screen">
          { chartData && <LineChart data={chartData}/> }
        </section>
      </div>

    </div>
  );
}

export default App;
