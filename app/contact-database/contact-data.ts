// Contact Database seed data.
// Only Investment Banking is live today. Every other vertical renders the
// "in progress" panel, so no data is needed for them yet.
// These rows are placeholders until the real dataset is wired in.

export type ContactRole = {
  title: string;
  dates: string;
  duration: string;
  location: string;
};

export type ContactExperience = {
  company: string;
  duration: string;
  roles: ContactRole[];
};

export type ContactEducation = {
  school: string;
  degree: string;
  dates: string;
};

export type DbContact = {
  id: string;
  first: string;
  last: string;
  company: string;
  title: string;
  seniority: string; // matches the Position filter options
  school: string;
  classYear: string;
  location: string;
  linkedin: string;
  email: string;
  experience: ContactExperience[];
  education: ContactEducation[];
};

export const POSITIONS = ['Analyst', 'Associate', 'VP', 'Director', 'Managing Director'];

export const IB_CONTACTS: DbContact[] = [
  {
    id: 'ib-1',
    first: 'Priya',
    last: 'Raman',
    company: 'Goldman Sachs',
    title: 'Investment Banking Associate - TMT',
    seniority: 'Associate',
    school: 'Ohio State University',
    classYear: "'21",
    location: 'New York, New York',
    linkedin: 'linkedin.com/in/priya-raman-example',
    email: 'priya.raman@example.com',
    experience: [
      {
        company: 'Goldman Sachs',
        duration: '4 yrs 2 mos',
        roles: [
          {
            title: 'Investment Banking Associate - TMT',
            dates: 'Jul 2024 - Present',
            duration: '2 yrs 0 mos',
            location: 'New York, New York, United States',
          },
          {
            title: 'Investment Banking Analyst - TMT',
            dates: 'Jul 2022 - Jul 2024',
            duration: '2 yrs 0 mos',
            location: 'New York, New York, United States',
          },
        ],
      },
      {
        company: 'Jefferies',
        duration: '3 mos',
        roles: [
          {
            title: 'Summer Analyst - Industrials',
            dates: 'Jun 2021 - Aug 2021',
            duration: '3 mos',
            location: 'Chicago, Illinois, United States',
          },
        ],
      },
    ],
    education: [
      {
        school: 'Ohio State University',
        degree: 'BS, Finance',
        dates: '2017 - 2021',
      },
    ],
  },
  {
    id: 'ib-2',
    first: 'Daniel',
    last: 'Whitfield',
    company: 'Evercore',
    title: 'Vice President - M&A',
    seniority: 'VP',
    school: 'University of Michigan',
    classYear: "'14",
    location: 'Chicago, Illinois',
    linkedin: 'linkedin.com/in/daniel-whitfield-example',
    email: 'daniel.whitfield@example.com',
    experience: [
      {
        company: 'Evercore',
        duration: '6 yrs 5 mos',
        roles: [
          {
            title: 'Vice President - M&A',
            dates: 'Feb 2023 - Present',
            duration: '3 yrs 5 mos',
            location: 'Chicago, Illinois, United States',
          },
          {
            title: 'Associate - M&A',
            dates: 'Feb 2020 - Feb 2023',
            duration: '3 yrs 0 mos',
            location: 'New York, New York, United States',
          },
        ],
      },
      {
        company: 'Houlihan Lokey',
        duration: '3 yrs 6 mos',
        roles: [
          {
            title: 'Investment Banking Analyst',
            dates: 'Aug 2016 - Feb 2020',
            duration: '3 yrs 6 mos',
            location: 'Chicago, Illinois, United States',
          },
        ],
      },
    ],
    education: [
      {
        school: 'University of Michigan',
        degree: 'BBA, Ross School of Business',
        dates: '2010 - 2014',
      },
    ],
  },
];
