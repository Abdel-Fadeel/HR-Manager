import { useFormik } from "formik";
import * as yup from "yup";
import LoadingButton from "@mui/lab/LoadingButton";
import { CssBaseline, Box, Typography, Container } from "@mui/material";
import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { useMutation } from "@tanstack/react-query";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ReactNode } from "react";
import { Dayjs } from "dayjs";

const validationSchema = yup.object({
  leavingDate: yup
    .date()
    .required("Leaving Date is required")
    .typeError("Invalid format"),
  expectedReturnDate: yup
    .date()
    .required("Expected Return Date is required")
    .typeError("Invalid format"),
});

interface VacationFormProps {
  initialValues: {
    idNumber: number;
    employeeName: string;
    leavingDate: Dayjs;
    expectedReturnDate: Dayjs;
  };
  method: "POST" | "PATCH";
  url: string;
  successFn?: () => void;
}

export const VacationForm: React.FC<VacationFormProps> = ({
  initialValues,
  method,
  url,
  successFn,
}) => {
  const { mutateAsync } = useMutation({
    mutationKey: ["employee"],
    mutationFn: async (employee: any) => {
      await customFetch(url, {
        method,
        data: employee,
      });
    },
    onSuccess: successFn,
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        await mutateAsync(values);
        toast.success(
          `${method === "POST" ? "Created" : "Updated"} vacation  successfully.`
        );
        resetForm();
      } catch (err) {
        toast.error((err as any)?.response?.data?.message);
      }
    },
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container component="main" maxWidth="lg">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 3.5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography component="h1" variant="h5">
            {method === "POST" ? "Add" : "Update"} Vacation
          </Typography>
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              formik.handleSubmit(e);
            }}
            noValidate
            sx={{
              mt: 1,
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              columnGap: 3,
              rowGap: 0,
            }}
          >
            <DatePicker
              label="Leaving Date"
              format="DD/MM/YYYY"
              value={formik.values.leavingDate}
              onChange={(value) => {
                formik.setFieldValue("leavingDate", value, true);
              }}
              slotProps={{
                textField: {
                  margin: "normal",
                  variant: "outlined",
                  onBlur: () => formik.setFieldTouched("leavingDate", true),
                  error:
                    formik.touched.leavingDate &&
                    Boolean(formik.errors.leavingDate),
                  helperText:
                    formik.touched.leavingDate &&
                    (formik.errors.leavingDate as ReactNode),
                },
              }}
            />
            <DatePicker
              label="Expected Return Date"
              format="DD/MM/YYYY"
              value={formik.values.leavingDate}
              onChange={(value) => {
                formik.setFieldValue("expectedReturnDate", value, true);
              }}
              slotProps={{
                textField: {
                  margin: "normal",
                  variant: "outlined",
                  onBlur: () =>
                    formik.setFieldTouched("expectedReturnDate", true),
                  error:
                    formik.touched.expectedReturnDate &&
                    Boolean(formik.errors.expectedReturnDate),
                  helperText:
                    formik.touched.expectedReturnDate &&
                    (formik.errors.expectedReturnDate as ReactNode),
                },
              }}
            />
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={formik.isSubmitting}
              loading={formik.isSubmitting}
            >
              <span>Submit</span>
            </LoadingButton>
          </Box>
        </Box>
      </Container>
    </LocalizationProvider>
  );
};

export default VacationForm;
