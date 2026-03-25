'use client';

import Sidebar from "../components/Sidebar";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import '../contact-finder/contact-finder.css';

const JOBS = [
  { id:1, title:'Public Finance IB Analyst - Healthcare', company:'Piper Sandler', industry:'Investment Banking', type:'Full-Time', location:'Columbus, OH', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'PS', color:'#003d6b', isNew:true, link:'https://www.pipersandler.com/careers' },
  { id:2, title:'2026 Full Time Analyst - Global Markets Sales & Trading', company:'BNP Paribas', industry:'Sales & Trading', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BP', color:'#006b3f', isNew:true, link:'https://group.bnpparibas/en/careers' },
  { id:3, title:'2026 Full Time Analyst - Global Markets Equity Research', company:'BNP Paribas', industry:'Equity Research', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BP', color:'#006b3f', isNew:true, link:'https://group.bnpparibas/en/careers' },
  { id:4, title:'2026 Wealth & Investment Management Analyst Program', company:'Wells Fargo', industry:'Asset Management', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'WF', color:'#d71e28', isNew:true, link:'https://www.wellsfargojobs.com/' },
  { id:5, title:'2026 Asset Management Product Program Full-Time Analyst', company:'JPMorgan Chase & Co.', industry:'Asset Management', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'JC', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers' },
  { id:6, title:'Quantitative Trader', company:'Jane Street', industry:'Quantitative Finance', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'JS', color:'#2d6a4f', isNew:true, link:'https://www.janestreet.com/join-jane-street/' },
  { id:7, title:'Quantitative Researcher', company:'Jane Street', industry:'Quantitative Finance', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'JS', color:'#2d6a4f', isNew:true, link:'https://www.janestreet.com/join-jane-street/' },
  { id:8, title:'Kearney Business Analyst 2026', company:'Kearney', industry:'Consulting', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'KEA', color:'#1a1a2e', isNew:true, link:'https://www.kearney.com/careers' },
  { id:9, title:'Economics Consulting Analyst 2026', company:'Charles River Associates', industry:'Consulting', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'CR', color:'#1a1a2e', isNew:true, link:'https://www.crai.com/careers/' },
  { id:10, title:'Finance Consulting Analyst 2026', company:'Charles River Associates', industry:'Consulting', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'CR', color:'#1a1a2e', isNew:true, link:'https://www.crai.com/careers/' },
  { id:11, title:'Quantitative Analyst', company:'The D. E. Shaw Group', industry:'Quantitative Finance', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'DE', color:'#2c3e50', isNew:true, link:'https://www.deshaw.com/' },
  { id:12, title:'2026 New Analyst Program', company:'Goldman Sachs', industry:'Investment Banking', type:'Full-Time', location:'Multiple US offices', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'GS', color:'#0c0c0c', isNew:true, link:'https://www.goldmansachs.com/careers/students/programs-and-internships/americas/new-analyst-program' },
  { id:13, title:'2026 Investment Management Full-Time Analyst Program', company:'Morgan Stanley', industry:'Asset Management', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'MS', color:'#003580', isNew:true, link:'https://www.morganstanley.com/careers/campus' },
  { id:14, title:'2026 Full-Time Analyst - Global Investment Banking', company:'Barclays', industry:'Investment Banking', type:'Full-Time', location:'New York, NY', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BAR', color:'#00aeef', isNew:true, link:'https://search.jobs.barclays/' },
  { id:15, title:'2026 Corporate & Investment Banking Associate Program', company:'Wells Fargo', industry:'Investment Banking', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'WF', color:'#d71e28', isNew:true, link:'https://www.wellsfargojobs.com/' },
  { id:16, title:'2026 Analyst Program', company:'TPG', industry:'Private Equity', type:'Full-Time', location:'San Francisco, New York', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'TPG', color:'#553c9a', isNew:true, link:'https://www.tpg.com/careers' },
  { id:17, title:'2026 Full-Time Analyst - Private Equity', company:'Ares Management', industry:'Private Equity', type:'Full-Time', location:'Los Angeles, CA', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'AM', color:'#1e3a5f', isNew:true, link:'https://www.aresmgmt.com/careers' },
  { id:18, title:'Point72 Academy Investment Analyst Program 2026', company:'Point72', industry:'Quantitative Finance', type:'Full-Time', location:'New York, Stamford', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'POI', color:'#003366', isNew:true, link:'https://careers.point72.com/' },
  { id:19, title:'Associate Consultant 2026', company:'Bain & Company', industry:'Consulting', type:'Full-Time', location:'Multiple US offices', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BM', color:'#8B0000', isNew:true, link:'https://www.bain.com/careers/' },
  { id:20, title:'BCG Associate 2026', company:'Boston Consulting Group', industry:'Consulting', type:'Full-Time', location:'Multiple US offices', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BC', color:'#006400', isNew:true, link:'https://careers.bcg.com/' },
  { id:21, title:'Business Analyst Full-Time 2026', company:'McKinsey & Company', industry:'Consulting', type:'Full-Time', location:'Multiple US offices', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'MM', color:'#1b1b1b', isNew:true, link:'https://www.mckinsey.com/careers/search-jobs' },
  { id:22, title:'2026 Full-Time Analyst Program', company:'BlackRock', industry:'Asset Management', type:'Full-Time', location:'New York, Multiple US', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'BLA', color:'#1a1a2e', isNew:true, link:'https://careers.blackrock.com/' },
  { id:23, title:'Financial Analyst Class of 2026 - General Partner Advisory', company:'Houlihan Lokey', industry:'Investment Banking', type:'Full-Time', location:'Multiple US offices', classYear:'2026', posted:'2026-03-16', deadline:'2026-03-20', logo:'HL', color:'#702459', isNew:true, link:'https://www.hl.com/careers' },
  { id:24, title:'Commercial Middle Market Program Summer 2026 Intern', company:'Fifth Third Bank', industry:'Investment Banking', type:'Summer Internship', location:'Dallas, TX', classYear:'2027', posted:'2026-03-16', deadline:'2026-03-30', logo:'FT', color:'#1b5e20', isNew:true, link:'https://www.53.com/content/fifth-third/en/careers.html' },
  { id:25, title:'2027 Analyst FIG NY', company:'Apollo Global Management', industry:'Private Equity', type:'Full-Time Analyst', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'AG', color:'#1a202c', isNew:true, link:'https://www.apollo.com/careers' },
  { id:26, title:'Analyst ABF Asset Management', company:'The Carlyle Group', industry:'Asset Management', type:'Full-Time Analyst', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'CG', color:'#1e3a5f', isNew:true, link:'https://www.carlyle.com/careers' },
  { id:27, title:'2027 Onsite Diligence & Growth Strategy Analyst', company:'Insight Partners', industry:'Private Equity', type:'Full-Time Analyst', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'IP', color:'#553c9a', isNew:true, link:'https://www.insightpartners.com/careers/' },
  { id:28, title:'2027 Full Time Investment Analyst', company:'Insight Partners', industry:'Private Equity', type:'Full-Time Analyst', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'IP', color:'#553c9a', isNew:true, link:'https://www.insightpartners.com/careers/' },
  { id:29, title:'2026 Summer Analyst Class of 2027 - Portfolio Human Capital', company:'General Atlantic', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'GA', color:'#1e3a5f', isNew:true, link:'https://www.generalatlantic.com/careers/' },
  { id:30, title:'2026 Summer Risk Internship', company:'Capstone', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'CAP', color:'#1a1a2e', isNew:true, link:'https://www.capstonedc.com/careers' },
  { id:31, title:'2026 Latin America Debt Capital Markets Summer Analyst', company:'JPMorgan Chase & Co.', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-04-02', logo:'JC', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers' },
  { id:32, title:'2026 Investment Banking Seasonal/OffCycle Internship', company:'Goldman Sachs', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'GS', color:'#0c0c0c', isNew:true, link:'https://www.goldmansachs.com/careers/students/' },
  { id:33, title:'Internship - Credit & Structured Finance Market Risk', company:'Societe Generale Americas', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'SG', color:'#e2001a', isNew:true, link:'https://careers.societegenerale.com/' },
  { id:34, title:'Summer 2026 Investment Internship', company:'Capstone', industry:'Asset Management', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'CAP', color:'#1a1a2e', isNew:true, link:'https://www.capstonedc.com/careers' },
  { id:35, title:'Deutsche Bank Internship - Investment Bank & Capital Markets - SF 2026', company:'Deutsche Bank', industry:'Investment Banking', type:'Summer Internship', location:'San Francisco, CA', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'DB', color:'#0018a8', isNew:true, link:'https://careers.db.com/students-graduates/' },
  { id:36, title:'Healthcare Consulting Intern Summer 2026', company:'Huron', industry:'Consulting', type:'Summer Internship', location:'Chicago, IL', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'HUR', color:'#0066cc', isNew:true, link:'https://www.huronconsultinggroup.com/careers' },
  { id:37, title:'2026 Business & Strategy Consulting Intern', company:'West Monroe', industry:'Consulting', type:'Summer Internship', location:'Dallas, TX', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'WM', color:'#003087', isNew:true, link:'https://www.westmonroe.com/careers' },
  { id:38, title:'Analyst Investment Banking BDO Capital Advisors 2027', company:'BDO Capital Advisors', industry:'Investment Banking', type:'Full-Time Analyst', location:'Richmond, VA', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'BC', color:'#cc0000', isNew:true, link:'https://www.bdocapitaladvisors.com/' },
  { id:39, title:'Equity Research Intern Summer 2026', company:'Leerink Partners', industry:'Equity Research', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'LP', color:'#1a1a2e', isNew:true, link:'https://www.leerink.com/careers/' },
  { id:40, title:'Technology Consulting Intern 2027', company:'Protiviti', industry:'Consulting', type:'Summer Internship', location:'Atlanta, GA', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'PRO', color:'#c00', isNew:true, link:'https://www.protiviti.com/us-en/careers' },
  { id:41, title:'2026 Markets Systematic Trading Internship', company:'JPMorgan Chase & Co.', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-06-01', logo:'JC', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers' },
  { id:42, title:'2026 Global Investment Research Equity Research Seasonal', company:'Goldman Sachs', industry:'Equity Research', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'GS', color:'#0c0c0c', isNew:true, link:'https://www.goldmansachs.com/careers/students/' },
  { id:43, title:'Internship Private Asset Management Client Services', company:'Baird', industry:'Asset Management', type:'Summer Internship', location:'Milwaukee, WI', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'BAI', color:'#003399', isNew:true, link:'https://www.rwbaird.com/careers' },
  { id:44, title:'2026 Summer Analyst Program', company:'Goldman Sachs', industry:'Investment Banking', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'GS', color:'#0c0c0c', isNew:true, link:'https://www.goldmansachs.com/careers/students/programs-and-internships/americas/2026-summer-analyst-program' },
  { id:45, title:'2026 Summer Analyst Program', company:'Morgan Stanley', industry:'Investment Banking', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'MS', color:'#003580', isNew:true, link:'https://www.morganstanley.com/careers/campus' },
  { id:46, title:'Summer Analyst Program 2026', company:'Evercore', industry:'Investment Banking', type:'Summer Internship', location:'New York, Houston, LA, SF', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'EVE', color:'#8B0000', isNew:true, link:'https://www.evercore.com/careers/students-graduates/' },
  { id:47, title:'2026 Financial Advisory Summer Analyst Program', company:'Lazard', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'LAZ', color:'#2d3748', isNew:true, link:'https://www.lazard.com/careers/students/' },
  { id:48, title:'2026 Summer Analyst Program', company:'Blackstone', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'BLA', color:'#1a1a1a', isNew:true, link:'https://www.blackstone.com/careers/students/' },
  { id:49, title:'2026 Summer Analyst Program', company:'KKR', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'KKR', color:'#2c5282', isNew:true, link:'https://careers.kkr.com' },
  { id:50, title:'2026 Summer Analyst Program', company:'TPG', industry:'Private Equity', type:'Summer Internship', location:'San Francisco, CA', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'TPG', color:'#553c9a', isNew:true, link:'https://www.tpg.com/careers' },
  { id:51, title:'2026 Summer Analyst Program', company:'Apollo Global Management', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'AG', color:'#1a202c', isNew:true, link:'https://www.apollo.com/careers' },
  { id:52, title:'2026 Summer Analyst Program', company:'Carlyle', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'CAR', color:'#1e3a5f', isNew:true, link:'https://www.carlyle.com/careers' },
  { id:53, title:'Business Analyst Intern Summer 2026', company:'McKinsey & Company', industry:'Consulting', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-03-29', logo:'MM', color:'#1b1b1b', isNew:true, link:'https://www.mckinsey.com/careers/search-jobs/jobs/businessanalystintern-15275' },
  { id:54, title:'BCG Summer Associate 2026', company:'Boston Consulting Group', industry:'Consulting', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'BC', color:'#006400', isNew:true, link:'https://careers.bcg.com/' },
  { id:55, title:'Associate Consulting Intern 2026', company:'Bain & Company', industry:'Consulting', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-08-31', logo:'BM', color:'#8B0000', isNew:true, link:'https://careers.bain.com' },
  { id:56, title:'Summer Consulting Intern 2026', company:'Oliver Wyman', industry:'Consulting', type:'Summer Internship', location:'Boston, Chicago, NY, SF', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'OW', color:'#e2001a', isNew:true, link:'https://www.oliverwyman.com/careers.html' },
  { id:57, title:'EY-Parthenon Strategy Intern 2026', company:'EY Parthenon', industry:'Consulting', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'EP', color:'#ffe600', isNew:true, link:'https://www.ey.com/en_us/careers' },
  { id:58, title:'Summer Associate 2026', company:'L.E.K. Consulting', industry:'Consulting', type:'Summer Internship', location:'Boston, Chicago, LA, NY, SF', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'LC', color:'#003087', isNew:true, link:'https://www.lek.com/join-lek/apply/internships' },
  { id:59, title:'Data Scientist Internship Summer 2026', company:'Two Sigma', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'TS', color:'#553c9a', isNew:true, link:'https://careers.twosigma.com' },
  { id:60, title:'Quantitative Researcher Internship Summer 2026', company:'Two Sigma', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'TS', color:'#553c9a', isNew:true, link:'https://www.twosigma.com/careers/internships/' },
  { id:61, title:'Algorithm Trader Internship Summer 2026', company:'Hudson River Trading', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'HR', color:'#1e3a5f', isNew:true, link:'https://www.hudsonrivertrading.com/student-opportunities/' },
  { id:62, title:'2026 Summer Internship Program AMERS', company:'BlackRock', industry:'Asset Management', type:'Summer Internship', location:'New York, Multiple US', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'BLA', color:'#1a1a2e', isNew:true, link:'https://blackrock.tal.net/vx/mobile-1/brand-0/candidate/so/pm/1/pl/1/opp/9601-2026-Summer-Internship-Program-AMERS/en-GB' },
  { id:63, title:'2026 Summer Analyst Program', company:'J.P. Morgan', industry:'Investment Banking', type:'Summer Internship', location:'Multiple US offices', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'JM', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers/explore-opportunities/programs' },
  { id:64, title:'North Highland Summer Intern 2026', company:'North Highland', industry:'Consulting', type:'Summer Internship', location:'Atlanta, GA', classYear:'2027', posted:'2026-03-16', deadline:'2026-12-31', logo:'NH', color:'#e87722', isNew:true, link:'https://www.northhighland.com/careers' },
  { id:65, title:'Warburg Pincus Catalyst Program', company:'Warburg Pincus', industry:'Private Equity', type:'Early Careers Program', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-05-07', logo:'WP', color:'#1e3a5f', isNew:true, link:'https://www.warburgpincus.com/careers/' },
  { id:66, title:'2027 Point72 Academy Investment Analyst Summer Internship', company:'Point72', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'POI', color:'#003366', isNew:true, link:'https://careers.point72.com/' },
  { id:67, title:'2027 Investment Banking Summer Analyst - New York', company:'Solomon Partners', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'SP', color:'#1a1a2e', isNew:true, link:'https://www.solomonpartners.com/careers/' },
  { id:68, title:'2027 Investment Banking Summer Analyst - Chicago', company:'Solomon Partners', industry:'Investment Banking', type:'Summer Internship', location:'Chicago, IL', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'SP', color:'#1a1a2e', isNew:true, link:'https://www.solomonpartners.com/careers/' },
  { id:69, title:'Investment Banking Insights Bootcamp', company:'Raymond James Financial', industry:'Investment Banking', type:'Early Careers Program', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'RJ', color:'#003087', isNew:true, link:'https://www.raymondjames.com/careers' },
  { id:70, title:'Quantitative Analyst Internship Summer 2027', company:'Weiss Asset Management', industry:'Quantitative Finance', type:'Summer Internship', location:'Boston, MA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'WA', color:'#1a1a2e', isNew:true, link:'https://www.weissassetmanagement.com/careers' },
  { id:71, title:'Summer 2027 CIB Intern - M&A Investment Banking', company:'Fifth Third Bank', industry:'Investment Banking', type:'Summer Internship', location:'Charlotte, NC', classYear:'2028', posted:'2026-03-16', deadline:'2026-04-03', logo:'FT', color:'#1b5e20', isNew:true, link:'https://www.53.com/content/fifth-third/en/careers.html' },
  { id:72, title:'Summer 2027 Intern - CIB Sales and Trading', company:'Fifth Third Bank', industry:'Sales & Trading', type:'Summer Internship', location:'Cincinnati, OH', classYear:'2028', posted:'2026-03-16', deadline:'2026-04-03', logo:'FT', color:'#1b5e20', isNew:true, link:'https://www.53.com/content/fifth-third/en/careers.html' },
  { id:73, title:'Summer Investment Banking 2027 Internship', company:'Capstone Partners', industry:'Investment Banking', type:'Summer Internship', location:'Boston, MA', classYear:'2028', posted:'2026-03-16', deadline:'2026-03-27', logo:'CP', color:'#1a1a2e', isNew:true, link:'https://www.capstonepartners.com/careers/' },
  { id:74, title:'2027 Corporate Finance Summer Intern Analyst', company:'Rabobank Group', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'RG', color:'#ff6200', isNew:true, link:'https://www.rabobank.com/en/about-rabobank/careers/' },
  { id:75, title:'2027 Investment Banking Summer Internship - New York', company:'Oppenheimer & Co. Inc.', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'OI', color:'#1a1a2e', isNew:true, link:'https://www.oppenheimer.com/careers/' },
  { id:76, title:'2027 Investment Banking Summer Internship - Healthcare Miami', company:'Oppenheimer & Co. Inc.', industry:'Investment Banking', type:'Summer Internship', location:'Miami, FL', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'OI', color:'#1a1a2e', isNew:true, link:'https://www.oppenheimer.com/careers/' },
  { id:77, title:'2027 Investment Banking Summer Internship - Tech SF', company:'Oppenheimer & Co. Inc.', industry:'Investment Banking', type:'Summer Internship', location:'San Francisco, CA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'OI', color:'#1a1a2e', isNew:true, link:'https://www.oppenheimer.com/careers/' },
  { id:78, title:'Millennium Investment Internship 2027', company:'Millennium Management LLC', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'MM', color:'#1a1a2e', isNew:true, link:'https://www.mlp.com/careers/students/' },
  { id:79, title:'2027 Summer Analyst Program', company:'Lloyds Bank', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'LB', color:'#006a4e', isNew:true, link:'https://www.lloydsbankinggroup.com/careers/' },
  { id:80, title:'2027 Guggenheim Securities IB Summer Analyst - Private Capital Markets', company:'Guggenheim Partners', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'GP', color:'#1e3a5f', isNew:true, link:'https://careers.guggenheimpartners.com' },
  { id:81, title:'2027 Summer Analyst Internship - Corporate Functions Strategy', company:'BNP Paribas', industry:'Consulting', type:'Summer Internship', location:'Jersey City, NJ', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BP', color:'#006b3f', isNew:true, link:'https://group.bnpparibas/en/careers' },
  { id:82, title:'2027 Summer Analyst - Global Markets Sales Boston', company:'BNP Paribas', industry:'Sales & Trading', type:'Summer Internship', location:'Boston, MA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BP', color:'#006b3f', isNew:true, link:'https://group.bnpparibas/en/careers' },
  { id:83, title:'2027 Capital Markets Summer Analyst', company:'Starwood Capital Group', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'SC', color:'#1a1a2e', isNew:true, link:'https://www.starwoodcapital.com/careers/' },
  { id:84, title:'2027 Commercial Asset Management Summer Analyst', company:'Starwood Capital Group', industry:'Asset Management', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'SC', color:'#1a1a2e', isNew:true, link:'https://www.starwoodcapital.com/careers/' },
  { id:85, title:'2027 Summer Associate - Turnaround & Restructuring NY', company:'Berkeley Research Group, LLC', industry:'Consulting', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-03-27', logo:'BR', color:'#003087', isNew:true, link:'https://www.thinkbrg.com/careers/' },
  { id:86, title:'2027 Summer Associate - Turnaround & Restructuring LA', company:'Berkeley Research Group, LLC', industry:'Consulting', type:'Summer Internship', location:'Los Angeles, CA', classYear:'2028', posted:'2026-03-16', deadline:'2026-04-15', logo:'BR', color:'#003087', isNew:true, link:'https://www.thinkbrg.com/careers/' },
  { id:87, title:'Banking - IB Summer Analyst New York 2027', company:'Citi', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'CIT', color:'#003b7a', isNew:true, link:'https://jobs.citi.com/' },
  { id:88, title:'Markets - Quantitative Analysis Summer Analyst 2027', company:'Citi', industry:'Quantitative Finance', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'CIT', color:'#003b7a', isNew:true, link:'https://jobs.citi.com/' },
  { id:89, title:'Banking - Commercial Banking Summer Analyst Chicago 2027', company:'Citi', industry:'Investment Banking', type:'Summer Internship', location:'Chicago, IL', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'CIT', color:'#003b7a', isNew:true, link:'https://jobs.citi.com/' },
  { id:90, title:'2027 Blackstone Real Estate Core+ Summer Analyst', company:'Blackstone', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BLA', color:'#1a1a1a', isNew:true, link:'https://www.blackstone.com/careers/students/' },
  { id:91, title:'2027 Investment Banking Summer Analyst - M&A Advisory', company:'Jefferies', industry:'Investment Banking', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'JEF', color:'#2b2d42', isNew:true, link:'https://jefferies.tal.net/' },
  { id:92, title:'2027 Asset & Wealth Management Risk Summer Analyst', company:'JPMorgan Chase & Co.', industry:'Asset Management', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-10-01', logo:'JC', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers' },
  { id:93, title:'2027 Commercial Real Estate Summer Analyst Program', company:'JPMorgan Chase & Co.', industry:'Investment Banking', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-06-30', logo:'JC', color:'#003087', isNew:true, link:'https://www.jpmorganchase.com/careers' },
  { id:94, title:'2027 Americas Dallas Investment Banking Summer Analyst', company:'Goldman Sachs', industry:'Investment Banking', type:'Summer Internship', location:'Dallas, TX', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'GS', color:'#0c0c0c', isNew:true, link:'https://www.goldmansachs.com/careers/students/' },
  { id:95, title:'Summer 2027 Investment Analyst', company:'Bracebridge Capital', industry:'Asset Management', type:'Summer Internship', location:'Boston, MA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BC', color:'#1a1a2e', isNew:true, link:'https://www.bracebridgecapital.com/careers' },
  { id:96, title:'BCG Sophomore Summer Associate 2026', company:'Boston Consulting Group', industry:'Consulting', type:'Early Careers Program', location:'Multiple US offices', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BC', color:'#006400', isNew:true, link:'https://careers.bcg.com/' },
  { id:97, title:'Business Analyst Intern 2026', company:'McKinsey & Company', industry:'Consulting', type:'Early Careers Program', location:'Multiple US offices', classYear:'2028', posted:'2026-03-16', deadline:'2026-03-29', logo:'MM', color:'#1b1b1b', isNew:true, link:'https://www.mckinsey.com/careers/search-jobs' },
  { id:98, title:'2027 Summer Internship Program AMERS', company:'BlackRock', industry:'Asset Management', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BLA', color:'#1a1a2e', isNew:true, link:'https://careers.blackrock.com/' },
  { id:99, title:'Summer Intern 2027 CIFC Asset Management', company:'CIFC Asset Management', industry:'Asset Management', type:'Summer Internship', location:'Radnor, PA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'CA', color:'#1a1a2e', isNew:true, link:'https://www.cifcllc.com/careers' },
  { id:100, title:'Private Equity Summer Analyst 2027', company:'Orion Group', industry:'Private Equity', type:'Summer Internship', location:'New York, NY', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'OG', color:'#1a1a2e', isNew:true, link:'https://www.oriongroup.com/careers' },
  { id:101, title:'Summer Analyst Investment Banking Software M&A 2027', company:'AQ Technology Partners', industry:'Investment Banking', type:'Summer Internship', location:'Redwood City, CA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'AT', color:'#1a1a2e', isNew:true, link:'https://www.aqtechnologypartners.com/' },
  { id:102, title:'North Highland Summer Intern 2027', company:'North Highland', industry:'Consulting', type:'Summer Internship', location:'Atlanta, GA', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'NH', color:'#e87722', isNew:true, link:'https://www.northhighland.com/careers' },
  { id:103, title:'Guggenheim Securities IB Freshman Day on the Job Program', company:'Guggenheim Partners', industry:'Investment Banking', type:'Early Careers Program', location:'Remote', classYear:'2029', posted:'2026-03-16', deadline:'2026-03-17', logo:'GP', color:'#1e3a5f', isNew:true, link:'https://careers.guggenheimpartners.com' },
  { id:104, title:'Warburg Pincus Catalyst Program', company:'Warburg Pincus', industry:'Private Equity', type:'Early Careers Program', location:'New York, NY', classYear:'2029', posted:'2026-03-16', deadline:'2026-05-07', logo:'WP', color:'#1e3a5f', isNew:true, link:'https://www.warburgpincus.com/careers/' },
  { id:105, title:'2026 Audit & Assurance Full-Time Analyst', company:'Deloitte', industry:'Accounting / Audit / Tax', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'DL', color:'#86BC25', isNew:true, link:'https://apply.deloitte.com/' },
  { id:106, title:'2026 Tax Full-Time Associate', company:'PwC', industry:'Accounting / Audit / Tax', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'PW', color:'#eb8c00', isNew:true, link:'https://www.pwc.com/us/en/careers.html' },
  { id:107, title:'2026 Assurance Staff Auditor', company:'EY', industry:'Accounting / Audit / Tax', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'EY', color:'#ffe600', isNew:true, link:'https://www.ey.com/en_us/careers' },
  { id:108, title:'2026 Audit Associate', company:'KPMG', industry:'Accounting / Audit / Tax', type:'Full-Time', location:'Multiple Locations', classYear:'2026', posted:'2026-03-16', deadline:'2026-12-31', logo:'KP', color:'#00338D', isNew:true, link:'https://www.kpmg.us/careers.html' },
  { id:109, title:'Summer 2027 Audit & Assurance Intern', company:'Deloitte', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'DL', color:'#86BC25', isNew:true, link:'https://apply.deloitte.com/' },
  { id:110, title:'Summer 2027 Tax Intern', company:'PwC', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'PW', color:'#eb8c00', isNew:true, link:'https://www.pwc.com/us/en/careers.html' },
  { id:111, title:'Summer 2027 Assurance Intern', company:'EY', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'EY', color:'#ffe600', isNew:true, link:'https://www.ey.com/en_us/careers' },
  { id:112, title:'Summer 2027 Audit Intern', company:'KPMG', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'KP', color:'#00338D', isNew:true, link:'https://www.kpmg.us/careers.html' },
  { id:113, title:'Summer 2027 Tax Intern', company:'RSM', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'RS', color:'#002855', isNew:true, link:'https://rsmus.com/careers.html' },
  { id:114, title:'Summer 2027 Audit Intern', company:'Grant Thornton', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'GT', color:'#4B2D8E', isNew:true, link:'https://www.grantthornton.com/careers' },
  { id:115, title:'Summer 2027 Audit & Tax Intern', company:'BDO', industry:'Accounting / Audit / Tax', type:'Summer Internship', location:'Multiple Locations', classYear:'2028', posted:'2026-03-16', deadline:'2026-12-31', logo:'BD', color:'#E3051B', isNew:true, link:'https://www.bdo.com/careers' },
];

const INDUSTRIES = [...new Set((JOBS as any[]).map((j:any) => j.industry))].sort() as string[];
const TYPES = [...new Set((JOBS as any[]).map((j:any) => j.type))].sort() as string[];

const ALL_LOCATIONS = [
  'New York, NY','San Francisco, CA','Chicago, IL','Boston, MA','Los Angeles, CA','Houston, TX',
  'Dallas, TX','Washington, DC','Atlanta, GA','Miami, FL','Seattle, WA','Minneapolis, MN',
  'Denver, CO','Philadelphia, PA','Charlotte, NC','Austin, TX','Nashville, TN','Baltimore, MD',
  'Greenwich, CT','Stamford, CT','Menlo Park, CA','Palo Alto, CA',
  'London, UK','Hong Kong','Singapore','Tokyo, Japan','Dubai, UAE','Toronto, Canada',
  'Sydney, Australia','Frankfurt, Germany','Paris, France','Zurich, Switzerland','Multiple',
];
const ALL_COMPANIES = [
  // Bulge Brackets
  'Goldman Sachs','J.P. Morgan','Morgan Stanley','Barclays','Citi','Bank of America','UBS','Deutsche Bank','Wells Fargo','Credit Suisse','HSBC','BNP Paribas','Societe Generale','Nomura','Macquarie','RBC Capital Markets',
  // Elite Boutiques
  'Evercore','Lazard','Centerview Partners','PJT Partners','Moelis','Guggenheim Partners','Houlihan Lokey','Perella Weinberg Partners','Rothschild & Co','Ducera Partners',
  // Middle Market / Boutiques
  'William Blair','Raymond James','Jefferies','Cowen','Stifel','Piper Sandler','Canaccord Genuity','Lincoln International','Harris Williams','Robert W. Baird','Stephens Inc.',
  'KeyBanc Capital Markets','BMO Capital Markets','Truist Securities','Oppenheimer','Imperial Capital','Duff & Phelps','FTI Consulting','Hines',
  'BGL (Brown Gibbons Lang)','Baird','Wedbush Securities','Craig-Hallum','Lake Street Capital','Northland Securities','D.A. Davidson','Janney Montgomery Scott',
  'Citizens JMP','Needham & Company','B. Riley Securities','Benchmark Company','Ladenburg Thalmann','Maxim Group','Roth Capital Partners',
  // Private Equity
  'Blackstone','KKR','Apollo Global Management','Carlyle','Ares Management','TPG','Thoma Bravo','Vista Equity','Advent International','Hellman & Friedman',
  'Silver Lake','General Atlantic','Warburg Pincus','EQT','CVC Capital','Cinven','Permira','Clayton Dubilier & Rice','Insight Partners','Tiger Global',
  'Francisco Partners','Summit Partners','Bain Capital','Leonard Green & Partners','American Securities','Berkshire Partners','TA Associates','Great Hill Partners',
  'GTCR','Audax Private Equity','Genstar Capital','Welsh Carson','New Mountain Capital','Veritas Capital','Accel-KKR','Marlin Equity',
  // Quant / HF
  'Two Sigma','D.E. Shaw','Citadel','Citadel Securities','Jane Street','Hudson River Trading','Virtu Financial','Renaissance Technologies','Jump Trading','Point72',
  'Millennium Management','AQR Capital','Bridgewater Associates','Man Group','Winton Group','Elliott Management','Baupost Group','Lone Pine Capital',
  'Tiger Management','Viking Global','Third Point','Pershing Square','Greenlight Capital',
  // Consulting
  'McKinsey & Company','Boston Consulting Group','Bain & Company','Deloitte','EY','PwC','KPMG','LEK','Oliver Wyman','Strategy&','Accenture','Alvarez & Marsal',
  'FTI Consulting','Huron Consulting','West Monroe Partners','Kearney','Roland Berger','ZS Associates','Putnam Associates',
];
const TOP_LOCATIONS = ['New York, NY','Chicago, IL','San Francisco, CA','Los Angeles, CA','Boston, MA','Washington, DC','Houston, TX','Dallas, TX','Multiple'];
const TOP_COMPANIES = ['Goldman Sachs','J.P. Morgan','Morgan Stanley','Blackstone','KKR','Evercore','Lazard','Centerview Partners','McKinsey & Company','Jane Street','Citadel','Two Sigma'];


export default function JobBoardPage() {
  const [isDark, setIsDark] = useState(false);
  const [_userName, _setUserName] = useState({ first: '', last: '' });

  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('offerbell_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('offerbell_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('offerbell_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('offerbell_onboarding_profile');
      if (raw) {
        const p = JSON.parse(raw);
        _setUserName({ first: p.firstName || '', last: p.lastName || '' });
      }
    } catch (e) {}
  }, []);
  const _displayName = (_userName.first + ' ' + _userName.last).trim() || 'User';
  const _displayInitials = ((_userName.first[0] || '') + (_userName.last[0] || '')).toUpperCase() || 'U';

  const [activeYear, setActiveYear] = useState('all');
  const [filters, setFilters] = useState<Record<string,string|null>>({ industry:null, type:null, location:null, company:null });
  const [search, setSearch] = useState('');
  const [sortVal, setSortVal] = useState('deadline');
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [openDD, setOpenDD] = useState<string|null>(null);
  const [ddQ, setDdQ] = useState<Record<string,string>>({});

  useEffect(() => {
    const t = localStorage.getItem('offerbell-theme');
    if (t === 'dark') { document.documentElement.setAttribute('data-theme','dark'); setIsDark(true); }
    try { const s = localStorage.getItem('offerbell_saved_jobs'); if (s) setSaved(new Set(JSON.parse(s))); } catch(e) {}
  }, []);

  function toggleTheme() {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    setIsDark(!isDark);
    localStorage.setItem('offerbell-theme', next);
  }

  function toggleSave(id: number, e: React.MouseEvent) {
    e.stopPropagation();
    const n = new Set(saved);
    n.has(id) ? n.delete(id) : n.add(id);
    setSaved(n);
    localStorage.setItem('offerbell_saved_jobs', JSON.stringify([...n]));
  }

  function dlLabel(d: string) {
    if (d === '2026-12-31') return { text: 'Rolling', cls: '' };
    const days = Math.ceil((new Date(d).getTime() - Date.now()) / 864e5);
    if (days < 0) return { text: 'Closed', cls: '' };
    if (days <= 7) return { text: days + 'd left', cls: 'urgent' };
    if (days <= 21) return { text: days + 'd left', cls: 'soon' };
    return { text: new Date(d).toLocaleDateString('en-US',{month:'short',day:'numeric'}), cls: '' };
  }

  const today = new Date(); today.setHours(0,0,0,0);

  const filtered = (JOBS as any[]).filter((j:any) => {
    if (j.deadline !== '2026-12-31' && new Date(j.deadline) < today) return false;
    if (activeYear !== 'all' && j.classYear !== activeYear) return false;
    if (filters.industry && j.industry !== filters.industry) return false;
    if (filters.type && j.type !== filters.type) return false;
    if (filters.location && !j.location.includes(filters.location)) return false;
    if (filters.company && j.company !== filters.company) return false;
    const q = search.toLowerCase();
    if (q && !`${j.title} ${j.company} ${j.industry} ${j.location}`.toLowerCase().includes(q)) return false;
    return true;
  }).sort((a:any,b:any) => {
    if (sortVal==='deadline') return new Date(a.deadline).getTime()-new Date(b.deadline).getTime();
    if (sortVal==='company') return a.company.localeCompare(b.company);
    return new Date(b.posted).getTime()-new Date(a.posted).getTime();
  });

  const yCounts: Record<string,number> = {'2026':0,'2027':0,'2028':0,'2029':0};
  (JOBS as any[]).forEach((j:any) => { if(yCounts[j.classYear]!==undefined) yCounts[j.classYear]++; });

  const groups: Record<string,any[]> = {'2026':[],'2027':[],'2028':[],'2029':[]};
  filtered.forEach((j:any) => { if(groups[j.classYear]) groups[j.classYear].push(j); });

  function opts(key: string) {
    const all: Record<string,string[]> = { industry: INDUSTRIES as string[], type: TYPES as string[], location: ALL_LOCATIONS, company: ALL_COMPANIES };
    const top: Record<string,string[]> = { industry: INDUSTRIES as string[], type: TYPES as string[], location: TOP_LOCATIONS, company: TOP_COMPANIES };
    const q = (ddQ[key]||'').toLowerCase();
    return q ? all[key].filter((o:string)=>o.toLowerCase().includes(q)) : top[key];
  }

  const hasFilters = Object.values(filters).some(Boolean) || search;
  const chipLabels: Record<string,string> = {industry:'Industry',type:'Job Type',location:'Location',company:'Company'};

  return (
    <div className="app">
      <Sidebar activePage="job-board" />

      <main className="main" style={{padding:'32px 36px'}}>
        <div style={{marginBottom:24}}>
          <div style={{fontFamily:"'Instrument Serif',serif",fontSize:28,letterSpacing:'-.5px',color:'var(--text)',marginBottom:3}}>Job <em style={{fontStyle:'italic'}}>Board</em></div>
          <div style={{fontSize:13,color:'var(--text-3)',marginBottom:8}}>Live finance internship and full-time listings. No ghost postings.</div>
          <div style={{display:'inline-flex',alignItems:'center',gap:5,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:100,padding:'5px 12px',fontSize:11,fontWeight:700,color:'var(--text-2)'}}>
            <span style={{width:6,height:6,borderRadius:'50%',background:'#22c55e',display:'inline-block'}}></span>
            Updated regularly — expired listings hidden automatically
          </div>
        </div>

        <div style={{marginBottom:12}}>
          <div style={{position:'relative'}}>
            <svg style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',width:15,height:15,stroke:'var(--text-3)',pointerEvents:'none'}} fill="none" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search by role, company, or keyword…" style={{width:'100%',height:42,padding:'0 16px 0 40px',border:'1.5px solid var(--border-2)',borderRadius:10,fontSize:13,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--surface)',outline:'none'}}/>
          </div>
        </div>

        <div style={{display:'flex',gap:6,marginBottom:12,flexWrap:'wrap'}}>
          {([{k:'all',l:'All Years'},{k:'2026',l:'Class of 2026'},{k:'2027',l:'Class of 2027'},{k:'2028',l:'Class of 2028'},{k:'2029',l:'Class of 2029'}] as any[]).map((t:any)=>(
            <button key={t.k} onClick={()=>setActiveYear(t.k)} type="button" style={{padding:'7px 16px',borderRadius:100,fontSize:12,fontWeight:700,cursor:'pointer',border:`1.5px solid ${activeYear===t.k?'var(--text)':'var(--border-2)'}`,background:activeYear===t.k?'var(--text)':'var(--surface)',color:activeYear===t.k?'var(--surface)':'var(--text-2)',fontFamily:"'Sora',sans-serif"}}>
              {t.l}{t.k!=='all'&&<span style={{opacity:.6,marginLeft:4,fontSize:10}}>{yCounts[t.k]||0}</span>}
            </button>
          ))}
        </div>

        <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap',alignItems:'center',position:'relative',zIndex:10}}>
          <span style={{fontSize:11,fontWeight:700,color:'var(--text-3)',textTransform:'uppercase',letterSpacing:1}}>Filter:</span>
          {(['industry','type','location','company'] as string[]).map(key=>(
            <div key={key} style={{position:'relative'}}>
              <button onClick={()=>setOpenDD(openDD===key?null:key)} type="button" style={{display:'flex',alignItems:'center',gap:5,padding:'6px 12px',borderRadius:100,border:`1.5px solid ${filters[key]?'var(--text)':'var(--border-2)'}`,background:filters[key]?'var(--text)':'var(--surface)',fontSize:12,fontWeight:600,color:filters[key]?'var(--surface)':'var(--text-2)',cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>
                <span>{filters[key]||chipLabels[key]}</span>
                <svg width="10" height="10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {openDD===key&&(
                <div style={{position:'absolute',top:'calc(100% + 6px)',left:0,background:'var(--surface)',border:'1.5px solid var(--border)',borderRadius:12,zIndex:200,minWidth:220,boxShadow:'0 8px 32px rgba(0,0,0,.12)',padding:6}}>
                  {(key==='location'||key==='company')&&(
                    <div style={{padding:'4px 4px 6px'}}>
                      <input value={ddQ[key]||''} onChange={e=>setDdQ(d=>({...d,[key]:e.target.value}))} placeholder={`Search ${chipLabels[key].toLowerCase()}…`} style={{width:'100%',padding:'7px 10px',border:'1.5px solid var(--border-2)',borderRadius:8,fontSize:12,fontFamily:"'Sora',sans-serif",color:'var(--text)',background:'var(--bg)',outline:'none'}} autoFocus/>
                    </div>
                  )}
                  <div style={{maxHeight:240,overflowY:'auto'}}>
                    {opts(key).map((o:string)=>(
                      <button key={o} onMouseDown={e=>{e.preventDefault();setFilters(f=>({...f,[key]:f[key]===o?null:o}));setOpenDD(null);setDdQ(d=>({...d,[key]:''}));}} type="button" style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'7px 10px',borderRadius:7,fontSize:12,fontWeight:filters[key]===o?700:500,color:filters[key]===o?'var(--text)':'var(--text-2)',cursor:'pointer',width:'100%',textAlign:'left',background:'none',border:'none',fontFamily:"'Sora',sans-serif"}}>
                        {o}{filters[key]===o&&<span>✓</span>}
                      </button>
                    ))}
                    {!ddQ[key]&&(key==='location'||key==='company')&&<div style={{padding:'6px 10px 2px',fontSize:11,color:'var(--text-3)'}}>Type to search all…</div>}
                  </div>
                </div>
              )}
            </div>
          ))}
          {hasFilters&&<button onClick={()=>{setFilters({industry:null,type:null,location:null,company:null});setSearch('');}} type="button" style={{padding:'5px 12px',borderRadius:100,border:'1.5px solid #fecaca',background:'none',color:'#dc2626',fontSize:12,fontWeight:600,cursor:'pointer',fontFamily:"'Sora',sans-serif"}}>× Clear all</button>}
          <div style={{marginLeft:'auto',display:'flex',alignItems:'center',gap:8,fontSize:12,color:'var(--text-3)'}}>
            <span style={{fontWeight:600,color:'var(--text)'}}>{filtered.length}</span> listings
            <select value={sortVal} onChange={e=>setSortVal(e.target.value)} style={{border:'1.5px solid var(--border-2)',borderRadius:8,padding:'5px 10px',fontSize:12,fontFamily:"'Sora',sans-serif",color:'var(--text-2)',background:'var(--surface)',outline:'none',cursor:'pointer'}}>
              <option value="deadline">Deadline soonest</option>
              <option value="newest">Recently posted</option>
              <option value="company">Company A–Z</option>
            </select>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {filtered.length===0?(
            <div style={{textAlign:'center',padding:'80px 20px'}}>
              <div style={{fontFamily:"'Instrument Serif',serif",fontSize:22,fontStyle:'italic',color:'var(--text)',marginBottom:8}}>No listings found</div>
              <div style={{fontSize:14,color:'var(--text-3)'}}>Try adjusting your filters or search term.</div>
            </div>
          ):activeYear==='all'?(
            Object.entries(groups).filter(([,js])=>(js as any[]).length>0).map(([yr,js])=>(
              <div key={yr} style={{marginBottom:8}}>
                <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:10}}>
                  <div style={{fontFamily:"'Instrument Serif',serif",fontSize:20,color:'var(--text)'}}>Class of <em style={{fontStyle:'italic'}}>{yr}</em></div>
                  <div style={{flex:1,height:1,background:'var(--border)'}}/>
                  <div style={{fontSize:11,fontWeight:700,color:'var(--text-3)'}}>{(js as any[]).length} listing{(js as any[]).length!==1?'s':''}</div>
                </div>
                {(js as any[]).map((j:any,i:number)=><Card key={j.id} j={j} i={i} saved={saved.has(j.id)} onSave={toggleSave} dl={dlLabel(j.deadline)}/>)}
              </div>
            ))
          ):(
            filtered.map((j:any,i:number)=><Card key={j.id} j={j} i={i} saved={saved.has(j.id)} onSave={toggleSave} dl={dlLabel(j.deadline)}/>)
          )}
        </div>
      </main>
      {openDD&&<div onClick={()=>setOpenDD(null)} style={{position:'fixed',inset:0,zIndex:5}}/>}
    </div>
  );
}

function Card({j,i,saved,onSave,dl}:{j:any;i:number;saved:boolean;onSave:(id:number,e:React.MouseEvent)=>void;dl:{text:string;cls:string}}) {
  return (
    <div style={{background:'var(--surface)',border:'1.5px solid var(--border)',borderLeft:`3px solid ${saved?'#f59e0b':'transparent'}`,borderRadius:14,padding:'18px 20px',display:'grid',gridTemplateColumns:'1fr auto',gap:12,alignItems:'start',transition:'transform .15s'}}
      onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-1px)')}
      onMouseLeave={e=>(e.currentTarget.style.transform='translateY(0)')}>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        <div style={{display:'flex',alignItems:'flex-start',gap:12}}>
          <div style={{width:40,height:40,borderRadius:10,background:j.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:800,color:'#fff',flexShrink:0}}>{j.logo}</div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:'var(--text)',marginBottom:3,lineHeight:1.3}}>{j.title}</div>
            <div style={{fontSize:13,color:'var(--text-2)',fontWeight:500}}>{j.company}</div>
          </div>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:10,flexWrap:'wrap'}}>
          <span style={{fontSize:12,color:'var(--text-3)'}}>{j.location}</span>
        </div>
        <div style={{display:'flex',gap:5,flexWrap:'wrap'}}>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:'#eff6ff',color:'#1d4ed8'}}>{j.industry}</span>
          <span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:'var(--surface-2)',color:'var(--text-3)'}}>{j.type}</span>
          {j.isNew&&<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:'#f0fdf4',color:'#16a34a'}}>New</span>}
          {dl.cls==='urgent'&&<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:'#fef2f2',color:'#dc2626'}}>{dl.text}</span>}
          {saved&&<span style={{fontSize:10,fontWeight:700,padding:'3px 8px',borderRadius:5,background:'#fefce8',color:'#854d0e'}}>Saved</span>}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:10}}>
        <div style={{display:'flex',gap:6}}>
          <button onClick={e=>onSave(j.id,e)} type="button" style={{width:32,height:32,borderRadius:8,border:`1.5px solid ${saved?'#f59e0b':'var(--border-2)'}`,background:saved?'#fefce8':'var(--surface)',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <svg width="14" height="14" fill={saved?'#f59e0b':'none'} stroke={saved?'#f59e0b':'var(--text-3)'} viewBox="0 0 24 24"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
          </button>
          <a href={j.link} target="_blank" rel="noopener noreferrer" style={{padding:'8px 16px',borderRadius:9,background:'var(--text)',color:'var(--surface)',fontSize:12,fontWeight:700,textDecoration:'none',display:'flex',alignItems:'center'}}>Apply →</a>
        </div>
        <div style={{fontSize:10,fontWeight:700,color:dl.cls==='urgent'?'#dc2626':dl.cls==='soon'?'#d97706':'var(--text-3)',textAlign:'right'}}>
          {dl.text==='Rolling'?'Rolling':'Deadline: '+dl.text}
        </div>
      </div>
    </div>
  );
}
