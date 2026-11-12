import type { StaticImageData } from "next/image";

import campusMain from "@/public/images/campus/campus-main.jpg";
import heritageBuilding from "@/public/images/campus/heritage-building.jpg";
import libraryHall from "@/public/images/campus/library-hall.jpg";
import researchLab from "@/public/images/campus/research-lab.jpg";
import studentsLibrary from "@/public/images/campus/students-library.jpg";
import studentsWalking from "@/public/images/campus/students-walking.jpg";
import studentsCampus from "@/public/images/campus/students-campus.jpg";
import graduation from "@/public/images/campus/graduation.jpg";

/**
 * Every photograph used on the site, with its licence and attribution.
 * All images come from Wikimedia Commons (CC0, public domain, CC BY or CC BY-SA)
 * and are credited on the /credits page, as the CC BY / BY-SA licences require.
 * Import photos from here (not from /public directly) so credits never drift.
 */
export type CampusPhoto = {
  src: StaticImageData;
  alt: string;
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  source: string;
};

export const campusPhotos = {
  campusMain: {
    src: campusMain,
    alt: "Neoclassical main university building",
    title: "Attica 06-13 Athens 30 University.jpg",
    author: "A.Savin",
    license: "CC BY-SA 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Attica_06-13_Athens_30_University.jpg",
  },
  heritageBuilding: {
    src: heritageBuilding,
    alt: "Historic red-brick university building",
    title: "Department of Chemistry Building - Northern Facade - University of Dhaka - Dhaka 2015-05-31 2008.JPG",
    author: "Biswarup Ganguly",
    license: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Department_of_Chemistry_Building_-_Northern_Facade_-_University_of_Dhaka_-_Dhaka_2015-05-31_2008.JPG",
  },
  libraryHall: {
    src: libraryHall,
    alt: "University library reading hall",
    title: "Helsinki University Library Interior B - Marit Henriksson.jpg",
    author: "Marit Henriksson",
    license: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0",
    source: "https://commons.wikimedia.org/wiki/File:Helsinki_University_Library_Interior_B_-_Marit_Henriksson.jpg",
  },
  researchLab: {
    src: researchLab,
    alt: "Students working in a research laboratory",
    title: "Oregon State University Students, at the Forest Products Laboratory (20240709-FS-AFK-00963).jpg",
    author: "Forest Service Photography",
    license: "Public domain",
    licenseUrl: "",
    source: "https://commons.wikimedia.org/wiki/File:Oregon_State_University_Students,_at_the_Forest_Products_Laboratory_(20240709-FS-AFK-00963).jpg",
  },
  studentsLibrary: {
    src: studentsLibrary,
    alt: "Students studying in the library",
    title: "Sias Library - Students Studying 2017.jpg",
    author: "Gary Todd",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Sias_Library_-_Students_Studying_2017.jpg",
  },
  studentsWalking: {
    src: studentsWalking,
    alt: "Students walking to campus",
    title: "Students walking towards Komaba Campus, University of Tokyo.jpg",
    author: "Tokyo538",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Students_walking_towards_Komaba_Campus,_University_of_Tokyo.jpg",
  },
  studentsCampus: {
    src: studentsCampus,
    alt: "Students walking across campus",
    title: "A photo of two students, walking on the university campus Roeterseiland, Amsterdam; high resolution image by FotoDutch in June 2013.jpg",
    author: "Fons Heijnsbroek",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:A_photo_of_two_students,_walking_on_the_university_campus_Roeterseiland,_Amsterdam;_high_resolution_image_by_FotoDutch_in_June_2013.jpg",
  },
  graduation: {
    src: graduation,
    alt: "Graduates throwing their caps at sunset",
    title: "Malacca graduates (Unsplash).jpg",
    author: "Baim Hanif baim",
    license: "CC0",
    licenseUrl: "http://creativecommons.org/publicdomain/zero/1.0/deed.en",
    source: "https://commons.wikimedia.org/wiki/File:Malacca_graduates_(Unsplash).jpg",
  },
} satisfies Record<string, CampusPhoto>;

export type CampusPhotoKey = keyof typeof campusPhotos;
