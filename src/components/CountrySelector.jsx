import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Box,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";

const MotionTypography = motion(Typography);

export default function CountrySelector({ onLocationSelect }) {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const { data: countries = [] } = useQuery({
    queryKey: ["countries"],
    queryFn: async () => {
      const res = await fetch("https://api.countrystatecity.in/v1/countries", {
        headers: {
          "X-CSCAPI-KEY":
            "91cb503cb4d1bd38580dcebcd4a3b50f2f3ae77c29d6a52a8991d999c2a42658",
        },
      });
      if (!res.ok) throw new Error("Failed to fetch countries");
      return res.json();
    },
  });

  const { data: states = [] } = useQuery({
    queryKey: ["states", selectedCountry],
    queryFn: async () => {
      if (!selectedCountry) return [];
      const res = await fetch(
        `https://api.countrystatecity.in/v1/countries/${selectedCountry}/states`,
        {
          headers: {
            "X-CSCAPI-KEY":
              "91cb503cb4d1bd38580dcebcd4a3b50f2f3ae77c29d6a52a8991d999c2a42658",
          },
        }
      );
      if (!res.ok) throw new Error("Failed to fetch states");
      return res.json();
    },
    enabled: !!selectedCountry,
  });

  const handleCountryChange = (e) => {
    const countryCode = e.target.value;
    setSelectedCountry(countryCode);
    setSelectedState("");
    if (onLocationSelect) onLocationSelect(countryCode, "");
  };
const handleStateChange = (e) => {
  const stateCode = e.target.value;
  setSelectedState(stateCode);
  if (onLocationSelect) onLocationSelect(selectedCountry, stateCode, states);
};


  return (
     
   <Box
  sx={{
    display: "flex",
    justifyContent: "center",
    mt: 2,
   
  }}
>
  <Paper
    elevation={4}
    sx={{
      p: 1.5,
      display: "flex",
      flexDirection: "column",
      gap: 1.5,
      width: 250,
      borderRadius: 3,
      background: "#f7f9fc",
    }}
  >
   <MotionTypography
  variant="subtitle1"
  align="center"
  sx={{
    fontWeight: "bold",
    color: "#333",
    fontSize: 14,
    textShadow: "1px 1px 5px rgba(0,0,0,0.2)", // لمسة جمالية
  }}
  initial={{ y: -50, opacity: 0, rotate: -10 }} // البداية: فوق الصفحة و مائلة
  animate={{ y: 0, opacity: 1, rotate: 0 }}     // النهاية: بمكانها الطبيعي
  transition={{
    type: "spring",
    stiffness: 120,
    damping: 10,
    duration: 1.2,
    repeat: Infinity,
    repeatType: "reverse", // حركة ذهاب وعودة
  }}
>
  اختر موقعك
</MotionTypography>

    {/* الدولة */}
    <FormControl fullWidth size="small">
      <InputLabel sx={{ fontSize: 12 }}>الدولة</InputLabel>
      <Select
        value={selectedCountry}
        onChange={handleCountryChange}
        label="الدولة"
        size="small"
        sx={{
          backgroundColor: "#fff",
          borderRadius: 1,
          height: 32, // ارتفاع صغير جدًا
          fontSize: 13,
          "& .MuiSelect-select": {
            paddingY: 0.5,
            paddingX: 1,
          },
          "& fieldset": {
            borderColor: "#0288D1",
            borderWidth: 1,
          },
          "&:hover fieldset": { borderColor: "#0277BD" },
          "&.Mui-focused fieldset": { borderColor: "#01579B" },
        }}
        MenuProps={{
          PaperProps: { sx: { maxHeight: 200, fontSize: 13 } },
        }}
      >
        {countries.map((country) => (
          <MenuItem key={country.iso2} value={country.iso2} sx={{ fontSize: 13, py: 0.5 }}>
            {country.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* المحافظة */}
    {states.length > 0 && (
      <FormControl fullWidth size="small">
        <InputLabel sx={{ fontSize: 12 }}>المحافظة</InputLabel>
        <Select
          value={selectedState}
          onChange={handleStateChange}
          label="المحافظة"
          size="small"
          sx={{
            backgroundColor: "#fff",
            borderRadius: 1,
            height: 32,
            fontSize: 13,
            "& .MuiSelect-select": { paddingY: 0.5, paddingX: 1 },
            "& fieldset": { borderColor: "#0288D1", borderWidth: 1 },
            "&:hover fieldset": { borderColor: "#0277BD" },
            "&.Mui-focused fieldset": { borderColor: "#01579B" },
          }}
          MenuProps={{
            PaperProps: { sx: { maxHeight: 200, fontSize: 13 } },
          }}
        >
          {states.map((state) => (
            <MenuItem key={state.iso2} value={state.iso2} sx={{ fontSize: 13, py: 0.5 }}>
              {state.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
  </Paper>
</Box>
  );
}
