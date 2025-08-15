import Academia from "../../../../../public/images/index-services/Academia.png";
import Bielefeld from "../../../../../public/images/index-services/Bielefeld-Academic-Search-Engine.png";
import DOAJ from "../../../../../public/images/index-services/DOAJ.png";
import Google from "../../../../../public/images/index-services/Google-Scholar.png";
import Index from "../../../../../public/images/index-services/Index-Copernicus-International.png";
import ISSUU from "../../../../../public/images/index-services/ISSUU.png";
import Mendeley from "../../../../../public/images/index-services/Mendeley.png";
import ORCID from "../../../../../public/images/index-services/ORCID.png";
import Scribd from "../../../../../public/images/index-services/Scribd.png";
import Semantic from "../../../../../public/images/index-services/Semantic-Scholar.png";
import Web from "../../../../../public/images/index-services/web-of-science.png";
import WorldCat from "../../../../../public/images/index-services/WorldCat.png";
import Zenodo from "../../../../../public/images/index-services/Zenodo.png";
import Crossref from "../../../../../public/images/index-services/Crossref.png";
import ISI from "../../../../../public/images/index-services/isi.png";
import EuroPub from "../../../../../public/images/index-services/Euro-Pub.png";
import Schilit from "../../../../../public/images/index-services/schilit.png";

const images = [
    { name: Google, link: "https://scholar.google.com/citations?user=CaBuTTQAAAAJ&hl=en" },
    { name: ORCID, link: "https://orcid.org/" },
    { name: Zenodo, link: "https://zenodo.org/" },
    { name: Academia, link: "https://independent.academia.edu/BationN" },
    { name: Bielefeld, link: "https://www.base-search.net/" },
    { name: Mendeley, link: "https://www.mendeley.com/" },
    // { name: DOAJ, link: "https://doaj.org/" },
    { name: Index, link: "https://journals.indexcopernicus.com/" },
    { name: ISSUU, link: "https://issuu.com/ditadsimrj" },
    { name: Scribd, link: "https://www.scribd.com/" },
    { name: Semantic, link: "https://www.semanticscholar.org/search?q=dit%20ads&sort=relevance" },
    // {
    //     name: Web,
    //     link: "https://clarivate.com/academia-government/scientific-and-academic-research/research-discovery-and-referencing/web-of-science/",
    // },
    { name: WorldCat, link: "https://search.worldcat.org/" },
    { name: Crossref, link: "https://www.crossref.org/" },
    { name: ISI, link: "https://www.isindexing.com/isi/" },
    { name: EuroPub, link: "https://europub.co.uk/journals/ditads-international-multidisciplinary-research-journal-J-32589#articles" },
    { name: Schilit, link: "https://www.scilit.com/" },
];

export default function IndexAbstract() {
    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
                <a
                    key={index}
                    href={image.link}
                    target="_blank"
                    className="size-full border p-4 flex items-center"
                >
                    <img
                        src={image.name}
                        alt={`indexing-${index}`}
                        className="object-contain"
                    />
                </a>
            ))}
        </div>
    );
}
