import { generalInfo } from './general';
import { piProfile } from './pi';
import { membersData } from './members';
import { researchData } from './research';
import { publicationList } from './publications';
import { galleryImages, newsPosts } from './media';

// 기존 컴포넌트들이 사용하는 구조(DATA 객체)를 그대로 유지하면서 조립합니다.
export const DATA = {
    ...generalInfo,          // labName, labShortName
    pi: piProfile,           // pi 정보
    researchIntro: researchData.intro, // researchIntro
    researchHighlights: researchData.highlights, // researchHighlights
    members: membersData,    // members
    publications: publicationList, // publications
    gallery: galleryImages,  // gallery
    news: newsPosts          // news
};