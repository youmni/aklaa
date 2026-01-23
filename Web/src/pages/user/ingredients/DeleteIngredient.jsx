import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Spinner } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import ingredientService from "../../../services/ingredientService";

const DeleteIngredient = () => {
    const { t } = useTranslation('ingredient');
    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const deleteIngredient = async () => {
            if (!id) {
                enqueueSnackbar(t('delete.noIngredientSelected'), { variant: 'error' });
                navigate('/ingredients');
                return;
            }

            try {
                const response = await ingredientService.deleteIngredient(id);
                
                const successMsg = t('delete.deleteSuccess');
                
                enqueueSnackbar(successMsg, { variant: 'success' });
                navigate('/ingredients');
            } catch (error) {
                const errMsg = t('delete.deleteFailed');
                
                enqueueSnackbar(errMsg, { variant: 'error' });
                navigate('/ingredients');
            }
        };

        deleteIngredient();
    }, [id, navigate, enqueueSnackbar]);

    return (
        <Box
            p={8}
            maxW="1200px"
            mx="auto"
            bg="white"
            minH="calc(100vh - 73px)"
            display="flex"
            alignItems="center"
            justifyContent="center"
        >
            <Spinner size="xl" thickness="4px" color="#083951" />
        </Box>
    );
};

export default DeleteIngredient;
