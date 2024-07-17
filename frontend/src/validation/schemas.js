import * as Yup from "yup";

export const registerSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});
export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  password: Yup.string().required("Password is required"),
});
export const resetPasswordLinkSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
});
export const resetPasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match"
    ),
});

export const verifyEmailSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format"),
  otp: Yup.string().required("OTP is required"),
});

export const changePasswordSchema = Yup.object({
  password: Yup.string().required("Password is required"),
  password_confirmation: Yup.string()
    .required("Confirm password is required")
    .oneOf(
      [Yup.ref("password"), null],
      "Password and Confirm Password doesn't match"
    ),
});

export const titleDetailsSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  price: Yup.string().required("Price is required"),
  images: Yup.mixed().required("Please upload an image"),
});

export const itemsDetailsSchema = Yup.object({
  condition: Yup.string().required("Condition is required"),
  location: Yup.string().required("Location is required"),
  description: Yup.string().required("Description is required"),
});

export const auctionSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  price: Yup.string().required("Price is required"),
  images: Yup.mixed().required("Please upload an image"),
  start_bid_date: Yup.string()
    .required("Start bid Time is required")
    .oneOf(["1m", "1h", "1d"]),
  details: Yup.string().required("Details is required"),
});

export const messageSchema = Yup.object({
  text: Yup.string().required("Message is required"),
});
