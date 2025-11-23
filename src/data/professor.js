import { generalInfo } from './general';

export const professorProfile = {
    name: "Jeongho Kim (김정호)",
    title: "Professor",
    affiliation: generalInfo.affiliation,
    email: "jkim5@inha.ac.kr",
    phone: "032-860-7678",
    office: ["5N507 (Office)", "5N516 (Lab)"],
    img: "/img/Prof_JHK.jpg", 
    cvLink: "#",
    bio: [
        "I am a physical chemist who is interested in fast dynamics of chemical and biological reactions and photophysical processes in condensed phase.",
        "For real-time probing of such fast phenomena, I make use of time-resolved (pump-probe) techniques such as transient absorption spectroscopy, two-dimensional electronic spectroscopy, and time-resolved X-ray diffraction."
    ],
    education: [
        { year: "2004.08", desc: "Ph.D. in Chemistry, Univ. of Chicago" },
        { year: "1999.08", desc: "M.S. in Chemistry, Univ. of Chicago" },
        { year: "1998.08", desc: "B.S. in Chemistry, KAIST" }
    ],
    career: [
        { year: "2012.09 - Present", desc: `Professor, ${generalInfo.department}, ${generalInfo.university}` },
        { year: "2009.07 - 2012.08", desc: "Senior Researcher, KAIST" },
        { year: "2008.07 - 2009.06", desc: "Research Associate, Univ. of Toronto" },
        { year: "2004.10 - 2008.06", desc: "Postdoctoral Fellow, Univ. of Toronto" }
    ]
};
