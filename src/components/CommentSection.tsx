import Comments from "./Comments"

import { useState, useEffect } from "react";

const comments = [
    {
        name: "Rachit Kumar Pandey",
        comment: "Having worked with him, I can confidently say he delivers nothing short of perfection. Always striving to improve, his work speaks volumes for itself—no words needed.",
        title: "Student at IIT (ISM)",
        image: "/testimonials/rachit.jpg"
    },
    {
        name: "Shashvat Aghera",
        comment: "All his work is very minimalist, and refined, that at this point, his solutions to problems are not only convenient, but also a treat for the eyes. He crafts marvellous programs and websites.",
        title: "2nd year at SRM University",
        image: "https://cdn.sanity.io/images/4orhaocq/production/8885b7c77a8a32a1eaec3a75ea6910fa81355ed9-2250x3000.jpg"
    },
    {
        name: "Yogesh",
        comment: "Great UI and UX design skills and an experienced front-end developer. Inspired others in front-end development because of his exemplary work.",
        title: "Founder at Neugence",
        image: "/testimonials/yogesh.png"
    },
    {
        name: "Keshava raj",
        comment: "His work on this project was outstanding. His creativity, dedication, and attention to detail were evident in every aspect, resulting in exceptional outcomes. A true testament to his talent and hard work.",
        title: "Student at SRM University",
        image: "/testimonials/keshav.jpg"
    },
    {
        name: "Ishaan Khurana",
        comment: "One of the most talented developers I've ever met, he can create amazing designs and has the ability to make them a reality. The things he has made impacts thousands on a daily basis and i believe that any team would be lucky to have an asset like him",
        title: "Syndicate at NextTech Lab",
        image: "/testimonials/ishaan.png"
    },
    {
        name: "Abadima",
        comment: "He's an amazing developer and a great person to work with. I've worked with him for over two years on projects like simply-djs and simply-xp. He's talented, reliable, and great at problem-solving, making teamwork fun and productive.",
        title: "Contributor to simply-xp",
        image: "/testimonials/abadima.jpeg"
    }
];

export const LazyImage = ({ src, alt, className }: { src: string, alt: string, className: string }) => {
    const [loaded, setLoaded] = useState(false);
    const [imageSrc, setImageSrc] = useState("");

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setImageSrc(src);
            setLoaded(true);
        };
    }, [src]);

    return (
        <img
            src={loaded ? imageSrc : "placeholder.jpg"}
            alt={alt}
            className={`transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
        />
    );
};

export default function CommentSection() {
    return (
        <div className="max-w-screen-xl px-4 mx-auto flex flex-col mt-40 gap-48 items-center justify-center relative min-h-screen">
            {
                comments.map((comment, index) => (
                    <Comments
                        key={index}
                        index={index}
                        name={comment.name}
                        comment={comment.comment}
                        image={comment.image || ""}
                        title={comment.title}
                    />
                ))
            }
        </div>
    )
}