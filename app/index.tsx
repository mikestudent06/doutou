import { Redirect } from "expo-router";

export default function Index() {
  // For now, always show onboarding first. Later, gate this with persisted flag.
  return <Redirect href="/(onboarding)" />;
}
