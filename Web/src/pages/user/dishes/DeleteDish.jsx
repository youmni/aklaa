import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Spinner } from "@chakra-ui/react";
import { useSnackbar } from 'notistack';
import dishService from "../../../services/dishService";

const DeleteDish = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const deleteDish = async () => {
            if (!id) {
                enqueueSnackbar('No dish selected', { variant: 'error' });
                navigate('/dishes');
                return;
            }

            try {
                const response = await dishService.deleteDish(id);
                
                const successMsg = response?.data?.message
                    ? response.data.message
                    : 'Dish deleted successfully.';

                enqueueSnackbar(successMsg, { variant: 'success' });
                navigate('/dishes');
            } catch (error) {
                const errMsg =
                    error?.response?.data?.message ||
                    error?.message ||
                    'Failed to delete dish. Please try again.';
                
                enqueueSnackbar(errMsg, { variant: 'error' });
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
