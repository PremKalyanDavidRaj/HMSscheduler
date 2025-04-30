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
    A09: "/assets/images/infectious-gastroenteritis.jpg",
    A33: "/assets/images/tetanus-neonatorum.jpg",
    A34: "/assets/images/obstetrical-tetanus.jpg",
    A35: "/assets/images/other-tetanus.jpg",
    A46: "/assets/images/erysipelas.jpg",
    A55: "/assets/images/chlamydial-lymphogranuloma.jpg",
    A65: "/assets/images/nonvenereal-syphilis.jpg",
    A70: "/assets/images/chlamydia-psittaci.jpg",
    A78: "/assets/images/q-fever.jpg",
    A86: "/assets/images/unspecified-viral-encephalitis.jpg",
    A89: "/assets/images/unspecified-viral-cns-infection.jpg",
    A90: "/assets/images/dengue-fever.jpg",
    
    B01: "/assets/images/chickenpox.jpg",
    B03: "/assets/images/smallpox.jpg",
    B04: "/assets/images/monkeypox.jpg",
    B09: "/assets/images/unspecified-viral-skin-lesions.jpg",
    B20: "/assets/images/hiv-disease.jpg",
    B49: "/assets/images/unspecified-mycosis.jpg",
    B54: "/assets/images/unspecified-malaria.jpg",
    B59: "/assets/images/pneumocystosis.jpg",
    B64: "/assets/images/unspecified-protozoal-disease.jpg",
    B72: "/assets/images/dracunculiasis.jpg",
    B75: "/assets/images/trichinellosis.jpg",
    B79: "/assets/images/trichuriasis.jpg",
    B80: "/assets/images/enterobiasis.jpg",
    B86: "/assets/images/scabies.jpg",
    B89: "/assets/images/unspecified-parasitic-disease.jpg",
    B91: "/assets/images/sequelae-of-poliomyelitis.jpg",
    B92: "/assets/images/sequelae-of-leprosy.jpg",
    C01: "/assets/images/malignant-neoplasm-base-tongue.jpg",
    C07: "/assets/images/malignant-neoplasm-parotid-gland.jpg",
    C12: "/assets/images/malignant-neoplasm-pyriform-sinus.jpg",
    C19: "/assets/images/malignant-neoplasm-rectosigmoid-junction.jpg",
    C20: "/assets/images/malignant-neoplasm-rectum.jpg",
    C22: "/assets/images/liver-cancer.jpg",
    C23: "/assets/images/malignant-neoplasm-gallbladder.jpg",
  
    D34: "/assets/images/benign-neoplasm-thyroid.jpg",
    D45: "/assets/images/polycythemia-vera.jpg",
    D50: "/assets/images/anemia.jpg",
    D62: "/assets/images/acute-posthemorrhagic-anemia.jpg",
    D65: "/assets/images/disseminated-intravascular-coagulation.jpg",
    D66: "/assets/images/hereditary-factor-viii-deficiency.jpg",
    D67: "/assets/images/hereditary-factor-ix-deficiency.jpg",
    D71: "/assets/images/functional-disorders-neutrophils.jpg",
    D77: "/assets/images/other-disorders-blood.jpg",
    E02: "/assets/images/subclinical-iodine-deficiency.jpg",
    E11: "/assets/images/diabetes.jpg",
    E15: "/assets/images/nondiabetic-hypoglycemic-coma.jpg",
    E35: "/assets/images/endocrine-glands-disorders.jpg",
    E40: "/assets/images/kwashiorkor.jpg",
    E41: "/assets/images/nutritional-marasmus.jpg",
    E42: "/assets/images/marasmic-kwashiorkor.jpg",
    E43: "/assets/images/severe-protein-malnutrition.jpg",
    E45: "/assets/images/retarded-development-malnutrition.jpg",
    E46: "/assets/images/unspecified-malnutrition.jpg",
    E52: "/assets/images/niacin-deficiency.jpg",
    E54: "/assets/images/ascorbic-acid-deficiency.jpg",
    E58: "/assets/images/calcium-deficiency.jpg",
    E59: "/assets/images/selenium-deficiency.jpg",
    E60: "/assets/images/zinc-deficiency.jpg",
    E65: "/assets/images/localized-adiposity.jpg",
    E68: "/assets/images/sequelae-hyperalimentation.jpg",
    F04: "/assets/images/amnestic-disorder.jpg",
    F05: "/assets/images/delirium.jpg",
    F09: "/assets/images/unspecified-mental-disorder.jpg",
    F21: "/assets/images/schizotypal-disorder.jpg",
    F22: "/assets/images/delusional-disorders.jpg",
    F23: "/assets/images/brief-psychotic-disorder.jpg",
    F24: "/assets/images/shared-psychotic-disorder.jpg",
    F28: "/assets/images/other-psychotic-disorder.jpg",
    F29: "/assets/images/unspecified-psychosis.jpg",
    F32: "/assets/images/depression.jpg",
    F39: "/assets/images/unspecified-mood-disorder.jpg",
    F54: "/assets/images/psychological-factors.jpg",
    F59: "/assets/images/unspecified-behavioral-syndromes.jpg",
    F66: "/assets/images/other-sexual-disorders.jpg",
    F69: "/assets/images/unspecified-adult-personality-disorder.jpg",
    F70: "/assets/images/mild-intellectual-disabilities.jpg",
    F71: "/assets/images/moderate-intellectual-disabilities.jpg",
    F72: "/assets/images/severe-intellectual-disabilities.jpg",
    F73: "/assets/images/profound-intellectual-disabilities.jpg",
    F79: "/assets/images/unspecified-intellectual-disabilities.jpg",
    F82: "/assets/images/developmental-motor-disorder.jpg",
    F88: "/assets/images/other-psychological-development-disorders.jpg",
    F89: "/assets/images/unspecified-psychological-development-disorder.jpg",
    F99: "/assets/images/mental-disorder-unspecified.jpg",
    G01: "/assets/images/meningitis-bacterial.jpg",
    G02: "/assets/images/meningitis-other-infectious.jpg",
    G07: "/assets/images/intracranial-abscess.jpg",
    G08: "/assets/images/intracranial-phlebitis.jpg",
    G09: "/assets/images/sequelae-inflammatory-cns.jpg",
    G40: "/assets/images/epilepsy.jpg",
    H10: "/assets/images/conjunctivitis.jpg",
    I10: "/assets/images/hypertension.jpg",
    J45: "/assets/images/asthma.jpg",
    K35: "/assets/images/appendicitis.jpg",
    L40: "/assets/images/psoriasis.jpg",
    M16: "/assets/images/osteoarthritis.jpg",
    N18: "/assets/images/kidney-disease.jpg",
    O24: "/assets/images/diabetes-pregnancy.jpg",
    P07: "/assets/images/low-birth-weight.jpg",
    Q20: "/assets/images/heart-malformations.jpg",
    R10: "/assets/images/abdominal-pain.jpg",
    S72: "/assets/images/femur-fracture.jpg",
    T14: "/assets/images/injury-unspecified.jpg",
    U07: "/assets/images/covid19.jpg",
    V71: "/assets/images/mental-health.jpg",
    W00: "/assets/images/fall.jpg",
    X71: "/assets/images/self-harm.jpg",
    Y93: "/assets/images/activity-other.jpg",
    
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
