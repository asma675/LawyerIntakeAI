import Layout from "./Layout.jsx";

import Account from "./Account";

import Analytics from "./Analytics";

import Billing from "./Billing";

import ClientPortal from "./ClientPortal";

import Dashboard from "./Dashboard";

import Help from "./Help";

import IntakeDetail from "./IntakeDetail";

import IntakeForm from "./IntakeForm";

import Landing from "./Landing";

import Pricing from "./Pricing";

import Privacy from "./Privacy";

import Settings from "./Settings";

import Terms from "./Terms";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Account: Account,
    
    Analytics: Analytics,
    
    Billing: Billing,
    
    ClientPortal: ClientPortal,
    
    Dashboard: Dashboard,
    
    Help: Help,
    
    IntakeDetail: IntakeDetail,
    
    IntakeForm: IntakeForm,
    
    Landing: Landing,
    
    Pricing: Pricing,
    
    Privacy: Privacy,
    
    Settings: Settings,
    
    Terms: Terms,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Account />} />
                
                
                <Route path="/Account" element={<Account />} />
                
                <Route path="/Analytics" element={<Analytics />} />
                
                <Route path="/Billing" element={<Billing />} />
                
                <Route path="/ClientPortal" element={<ClientPortal />} />
                
                <Route path="/Dashboard" element={<Dashboard />} />
                
                <Route path="/Help" element={<Help />} />
                
                <Route path="/IntakeDetail" element={<IntakeDetail />} />
                
                <Route path="/IntakeForm" element={<IntakeForm />} />
                
                <Route path="/Landing" element={<Landing />} />
                
                <Route path="/Pricing" element={<Pricing />} />
                
                <Route path="/Privacy" element={<Privacy />} />
                
                <Route path="/Settings" element={<Settings />} />
                
                <Route path="/Terms" element={<Terms />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}