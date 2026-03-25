const fs = require('fs');
const path = require('path');

const workspacePath = '/Users/shomuradov/Desktop/kynect2';

const filesToFix = [
  'app/contact-finder/page.tsx',
  'app/job-board/page.tsx',
  'app/coach/page.tsx',
  'app/interview-prep/page.tsx',
  'app/recruiting-manual/page.tsx',
  'app/outreach-tracker/page.tsx'
];

const dashboardFile = 'app/dashboard/page.tsx';

const injectionCode = `
  const [messagesSent, setMessagesSent] = useState(0);
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try { setMessagesSent(parseInt(localStorage.getItem('kynect_messages_sent') || '0', 10)); } catch {}
    try {
      const plan = localStorage.getItem('kynect_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('kynect_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);
`;

const pillTarget = `<span className="nav-pill pill-count">5 left</span>`;
const pillReplacement = `{userPlan !== 'pro' && <span className="nav-pill pill-count">{Math.max(0, 5 - messagesSent)} left</span>}`;

filesToFix.forEach(fp => {
  const fullPath = path.join(workspacePath, fp);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    
    if (content.includes(pillTarget)) {
      content = content.replace(pillTarget, pillReplacement);
      
      if (!content.includes('const [messagesSent')) {
        const insertAnchor = /const \[_userName, _setUserName\] = useState\(.*?\);/;
        if (insertAnchor.test(content)) {
          content = content.replace(insertAnchor, match => match + '\n' + injectionCode);
        } else {
           const defaultExport = /export default function [a-zA-Z0-9_]+\(\) {/;
           if (defaultExport.test(content)) {
             content = content.replace(defaultExport, match => match + '\n' + injectionCode);
           }
        }
      }
      
      fs.writeFileSync(fullPath, content, 'utf8');
      console.log('Fixed', fp);
    }
  }
});

const dashPath = path.join(workspacePath, dashboardFile);
if (fs.existsSync(dashPath)) {
  let content = fs.readFileSync(dashPath, 'utf8');
  if (content.includes(pillTarget)) {
    content = content.replace(pillTarget, pillReplacement);
    
    if (!content.includes('const [userPlan')) {
       const msAnchor = 'const [messagesSent, setMessagesSent] = useState(0);';
       if (content.includes(msAnchor)) {
         const planCode = `
  const [userPlan, setUserPlan] = useState('free');
  useEffect(() => {
    try {
      const plan = localStorage.getItem('kynect_plan') || 'free';
      const prof = JSON.parse(localStorage.getItem('kynect_onboarding_profile') || '{}');
      setUserPlan(prof.plan || plan);
    } catch { setUserPlan('free'); }
  }, []);
`;
         content = content.replace(msAnchor, msAnchor + '\n' + planCode);
       }
    }
    
    fs.writeFileSync(dashPath, content, 'utf8');
    console.log('Fixed dashboard');
  }
}

console.log('Done desktop kynect2');
