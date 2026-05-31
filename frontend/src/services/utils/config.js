export const publicNavControls = [
  {
    label: "Home",
    destination: "/"
  },
  {
    label: "Features",
    destination: "/features"
  },
  {
    label: "About",
    destination: "/about"
  }
]

export const publicLoginControls = [
  {
    label: "Username or email",
    type: "text",
    name: "identifier",
    placeholder: "Input your username or email",
    required: true
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "Input your password",
    required: true
  },
]

export const publicRegisterControls = [
  {
    label: "Email",
    type: "email",
    name: "email",
    placeholder: "Input your email",
    required: true
  },
  {
    label: "Password",
    type: "password",
    name: "password",
    placeholder: "Input your password",
    required: true
  },
  {
    label: "Confirm password",
    type: "password",
    name: "confirmPassword",
    placeholder: "Confirm your password",
    required: true
  },
]

export const accountSetUpDetailsControls = [
  {
    label: "First name",
    type: "text",
    name: "firstName",
    placeholder: "Ex: John",
    required: true
  },
  {
    label: "Last name",
    type: "text",
    name: "lastName",
    placeholder: "Ex: Dela Cruz",
    required: true
  },
]