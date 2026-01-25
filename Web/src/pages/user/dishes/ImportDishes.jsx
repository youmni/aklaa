import { useState } from "react";
import { Box, Icon, Spinner, Heading, VStack, Checkbox, Link } from "@chakra-ui/react";
import { LuUpload, LuExternalLink } from "react-icons/lu";
import { useTranslation } from "react-i18next";
import { useThemeColors } from "../../../hooks/useThemeColors";
import dishService from "../../../services/dishService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";

const ImportDishes = () => {
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [multipleMode, setMultipleMode] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation("dish");
  const colors = useThemeColors();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      handleUpload(file);
      event.target.value = "";
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;

    setLoading(true);

    try {
      const text = await file.text();
      let json;
      
      try {
        json = JSON.parse(text);
      } catch {
        enqueueSnackbar(t("importInvalid"), { variant: "error" });
        setLoading(false);
        setSelectedFile(null);
        return;
      }

      try {
        await dishService.importDishFromJson(json);
        enqueueSnackbar(t("importSuccess"), { variant: "success" });
        
        if (multipleMode) {
          setSelectedFile(null);
          setTimeout(() => {
          }, 100);
        } else {
          navigate("/dishes");
        }
      } catch {
        enqueueSnackbar(t("importError"), { variant: "error" });
        setSelectedFile(null);
      }
    } catch {
      enqueueSnackbar(t("importError"), { variant: "error" });
      setSelectedFile(null);
    }

    setLoading(false);
  };

  return (
    <VStack spacing={6} align="stretch" maxW="xl" mx="auto" p={6}>
      <Heading size="lg" color={colors.text.primary}>
        {t("importTitle")}
      </Heading>
      
      <Box color={colors.text.secondary}>
        {t("importSubtitle")}
      </Box>

      <Checkbox.Root
        checked={multipleMode}
        onCheckedChange={(e) => setMultipleMode(e.checked)}
        disabled={loading}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control />
        <Checkbox.Label>
          {t("importMultipleMode")}
        </Checkbox.Label>
      </Checkbox.Root>

      <Box
        borderWidth="2px"
        borderStyle="dashed"
        borderColor={colors.border.default}
        borderRadius="lg"
        p={8}
        textAlign="center"
        bg={colors.bg.secondary}
        _hover={{
          borderColor: colors.button.primary.bg,
          bg: colors.bg.hover
        }}
        transition="all 0.2s"
        cursor="pointer"
        position="relative"
      >
        <input
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer"
          }}
          disabled={loading}
        />
        
        <VStack spacing={3}>
          <Icon 
            as={LuUpload} 
            boxSize={10} 
            color={colors.icon.view.default}
          />
          
          <Box color={colors.text.primary} fontWeight="medium">
            {loading ? t("importing") : t("importDropzoneSingle")}
          </Box>
          
          <Box color={colors.text.muted} fontSize="sm">
            .json
          </Box>

          {selectedFile && !loading && (
            <Box 
              color={colors.text.primary} 
              fontSize="sm"
              mt={2}
            >
              {selectedFile.name}
            </Box>
          )}
        </VStack>
      </Box>

      <Link
        href="/docs/dish-import-guide.html"
        isExternal
        color={colors.button.primary.bg}
        display="flex"
        alignItems="center"
        gap={2}
        fontSize="sm"
        _hover={{ textDecoration: "underline" }}
      >
        <Icon as={LuExternalLink} />
        {t("importDocumentation")}
      </Link>

      {loading && (
        <Box textAlign="center">
          <Spinner 
            size="md" 
            color={colors.button.primary.bg} 
          />
        </Box>
      )}
    </VStack>
  );
};

export default ImportDishes;