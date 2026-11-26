import { useFormik } from "formik";
import { UseMutateAsyncFunction } from "@tanstack/react-query";
import LoadingButton from "@mui/lab/LoadingButton";
import { companies } from "../utils/constants";
import {
  TextField,
  MenuItem,
  Box,
  Container,
  CssBaseline,
} from "@mui/material";

interface SponsorFormProps {
  queryFn: UseMutateAsyncFunction<any, unknown, any, unknown>;
  groupByHandler: (groupBy: string) => void;
  sponsorHandler: (sponsor: string) => void;
}

export const SponsorForm: React.FC<SponsorFormProps> = ({
  queryFn,
  groupByHandler,
  sponsorHandler,
}) => {
  const formik = useFormik({
    initialValues: {
      sponsor: companies[0],
      groupBy: "nationality",
    },
    onSubmit: async (values) => {
      try {
        await queryFn(values);
        groupByHandler(values.groupBy);
        sponsorHandler(values.sponsor);
      } catch (err) {
        // toast.error((err as any)?.response?.data?.message);
      }
    },
  });

  return (
    <Container component="main" className="h-full">
      <CssBaseline />
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          formik.handleSubmit(e);
        }}
        noValidate
        sx={{
          display: "grid",
          gridTemplateColumns: "3fr 2fr 2fr",
          alignItems: "center",
          columnGap: 3,
          rowGap: 0,
          maxWidth: 900,
          marginX: "auto",
        }}
        className="h-full"
      >
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          select
          name="sponsor"
          label="Sponsor"
          id="sponsor"
          value={formik.values.sponsor}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.sponsor && Boolean(formik.errors.sponsor)}
          helperText={formik.touched.sponsor && formik.errors.sponsor}
          className="bg-white"
        >
          {companies.map((c) => ({ value: c, label: c })).map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          margin="normal"
          required
          fullWidth
          size="small"
          select
          name="groupBy"
          label="Group By"
          id="groupBy"
          value={formik.values.groupBy}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.groupBy && Boolean(formik.errors.groupBy)}
          helperText={formik.touched.groupBy && formik.errors.groupBy}
        >
          {[
            { value: "nationality", label: "nationality" },
            { value: "workIn", label: "Work In" },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
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
    </Container>
  );
};

export default SponsorForm;
