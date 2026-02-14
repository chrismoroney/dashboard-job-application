import UploadPage from "../../components/UploadPage";
import AuthGuard from "../../components/AuthGuard";

export default function Page() {
  return (
    <AuthGuard>
      <UploadPage />
    </AuthGuard>
  );
}
