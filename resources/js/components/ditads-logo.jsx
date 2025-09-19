import Logo from "../../../public/images/ditads-logo.png";

export default function DitadsLogo() {
    return (
        <img
            src={Logo}
            className="object-contain rounded-full"
            alt="ditads-logo"
        />
    );
}
