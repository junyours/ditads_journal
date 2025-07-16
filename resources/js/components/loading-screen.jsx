import { ScaleLoader } from "react-spinners";

export default function LoadingScreen() {
    return (
        <div className="bg-black bg-opacity-75 min-h-screen z-50 fixed inset-0 flex items-center justify-center">
            <ScaleLoader color="green" />
        </div>
    );
}
