import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Box, Spinner } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import dishService from "../../../services/dishService";

const DeleteDish = () => {
    const { t } = useTranslation('dish');
    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const deleteDish = async () => {
            if (!id) {
                enqueueSnackbar(t('delete.noDishSelected'), { variant: 'error' });
                navigate('/dishes');
                return;
            }

            try {
                await dishService.deleteDish(id);
                
                enqueueSnackbar(t('delete.deleteSuccess'), { variant: 'success' });
                navigate('/dishes');
            } catch (error) {
                enqueueSnackbar(t('delete.deleteError'), { variant: 'error' });
                navigate('/dishes');
            }
        };

        deleteDish();
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

export default DeleteDish;
