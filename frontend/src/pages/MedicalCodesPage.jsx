import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Autocomplete,
  TextField,
  CircularProgress,
  Box,
  Button,
  Skeleton,
} from "@mui/material";
import axios from "axios";

const imageMap = {
  A00: "/assets/images/cholera.jpg",
  B01: "/assets/images/chickenpox.jpg",
  C22: "/assets/images/liver-cancer.jpg",
  D50: "/assets/images/anemia.jpg",
  E11: "/assets/images/diabetes.jpg",
  F32: "/assets/images/depression.jpg",
  I10: "/assets/images/hypertension.jpg",
};

const getImagePath = (code) => {
  const baseCode = code.split(".")[0];
  return imageMap[baseCode] || `/assets/images/${baseCode}.jpg`;
};

const normalizeCode = (code) => code.replace(".", "").toUpperCase();

const MedicalCodesPage = () => {
  const [searchInput, setSearchInput] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [localCodes, setLocalCodes] = useState([]);

  useEffect(() => {
    const fetchICDCodes = async () => {
      if (searchInput.trim().length < 1) {
        setOptions([]);
        return;
      }

      try {
        const res = await axios.get("/icd10.json");
        const filtered = res.data
          .filter((item) =>
            normalizeCode(item.code).includes(normalizeCode(searchInput)) ||
            item.description.toLowerCase().includes(searchInput.toLowerCase())
          )
          .map((item) => ({
            code: item.code,
            label: `${item.code} - ${item.description}`,
            description: item.description,
          }));

        console.log("Filtered options:", filtered);
        setOptions(filtered);
      } catch (err) {
        console.error("❌ Failed to load icd10.json:", err.message);
      }
    };

    const timeout = setTimeout(fetchICDCodes, 300);
    return () => clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    const loadAllCodes = async () => {
      try {
        const res = await axios.get("/icd10.json");
        setLocalCodes(res.data);
      } catch (err) {
        console.error("❌ Failed to load all ICD codes:", err.message);
      }
    };

    loadAllCodes();
  }, []);

  const handleSelect = async (event, value) => {
    if (!value) return;
    setLoading(true);
    setSelectedInfo(null);
    try {
      const res = await axios.get(`http://localhost:5001/api/medical-code-details/${value.code}`);
      setSelectedInfo(res.data);
    } catch (err) {
      setSelectedInfo({
        code: value.code,
        shortDesc: value.description || value.label?.split(" - ")[1] || "Custom or unlisted ICD code",
        aiDesc: "Could not fetch from AI.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Unified ICD-10 Search
      </Typography>

      <Autocomplete
        fullWidth
        freeSolo
        options={options}
        getOptionLabel={(option) => option.label || ""}
        onInputChange={(e, value) => setSearchInput(value)}
        onChange={handleSelect}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search ICD-10 code or condition"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading && <CircularProgress color="inherit" size={20} />}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        onKeyDown={(e) => {
          if (e.key === "Enter" && options.length > 0) {
            handleSelect(null, options[0]);
          }
        }}
      />

      {loading && (
        <Card sx={{ mt: 4, maxWidth: 600, mx: "auto", p: 2 }}>
          <Skeleton variant="rectangular" height={180} sx={{ mb: 2 }} />
          <Skeleton width="80%" height={28} />
          <Skeleton width="60%" height={20} sx={{ mt: 1 }} />
          <Skeleton width="100%" height={60} sx={{ mt: 2 }} />
        </Card>
      )}

      {selectedInfo && !loading && (
        <Card sx={{ mt: 4, maxWidth: 600, mx: "auto" }}>
          <CardMedia
            component="img"
            image={getImagePath(selectedInfo.code)}
            alt={selectedInfo.shortDesc}
            sx={{
              width: "100%",
              maxHeight: 300,
              objectFit: "contain",
              backgroundColor: "#fafafa",
              borderBottom: "1px solid #eee",
              p: 2,
            }}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/300x180.png?text=No+Image";
            }}
          />
          <CardContent>
            <Typography variant="h6">{selectedInfo.code}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              <strong>Short:</strong> {selectedInfo.shortDesc || "Not found"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 2 }}>
              <strong>Details:</strong> {selectedInfo.aiDesc || "Not available."}
            </Typography>
            <Button
              variant="outlined"
              sx={{ mt: 2 }}
              href={`https://www.google.com/search?q=ICD-10 ${selectedInfo.code} ${selectedInfo.shortDesc}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              🔍 Search on Google
            </Button>
          </CardContent>
        </Card>
      )}

      <Box sx={{ mt: 6 }}>
        <Typography variant="h5" gutterBottom>Browse Available Codes</Typography>
        <Box display="flex" flexWrap="wrap" gap={2}>
          {localCodes.map((item) => (
            <Card
              key={item.code}
              sx={{ width: 220, cursor: "pointer" }}
              onClick={() =>
                handleSelect(null, {
                  code: item.code,
                  description: item.description,
                  label: `${item.code} - ${item.description}`,
                })
              }
            >
              <CardMedia
                component="img"
                image={getImagePath(item.code)}
                alt={item.description}
                sx={{
                  maxHeight: 140,
                  objectFit: "contain",
                  p: 1,
                  backgroundColor: "#f8f8f8",
                }}
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/300x140.png?text=No+Image";
                }}
              />
              <CardContent>
                <Typography variant="subtitle1">{item.code}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default MedicalCodesPage;
