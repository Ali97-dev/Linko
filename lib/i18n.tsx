"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type Lang = "en" | "ar";

const translations = {
  en: {
    "nav.explore": "Explore",
    "nav.allProviders": "All providers",
    "nav.becomeProvider": "Become a provider",
    "nav.login": "Log in",
    "nav.join": "Join",
    "nav.menu": "Menu",
    "nav.closeMenu": "Close menu",
    "lang.english": "English",
    "lang.arabic": "Arabic",
    "hero.title1": "Kuwait's trusted",
    "hero.title2": "business marketplace",
    "hero.subtitle": "Find verified accounting, legal, tech, and marketing providers across Kuwait, all reviewed before they go live.",
    "search.placeholder": "Search for any service...",
    "search.button": "Search",
    "hero.footer": "Every provider on LINKO is reviewed and verified before they can go live.",
    "category.accounting": "Accounting",
    "category.legal": "Legal",
    "category.technology": "Technology",
    "category.marketing": "Marketing",
    "category.government-pro-services": "Government / PRO Services",
    "auth.loginTitle": "Welcome back",
    "auth.loginSubtitle": "Log in to your LINKO account.",
    "auth.loginPanelTitle": "Welcome back to Kuwait's trusted business marketplace.",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.loginButton": "Log in",
    "auth.loggingIn": "Logging in...",
    "auth.noAccount": "No account?",
    "auth.registerLink": "Register",
    "auth.registerTitle": "Create an account",
    "auth.registerSubtitle": "Choose how you'll use LINKO.",
    "auth.registerPanelTitle": "Join Kuwait's trusted business marketplace.",
    "auth.roleBusiness": "Business",
    "auth.roleBusinessHint": "Find providers",
    "auth.roleProvider": "Provider",
    "auth.roleProviderHint": "Offer services",
    "auth.companyName": "Company name",
    "auth.contactPerson": "Contact person",
    "auth.workEmail": "Work email",
    "auth.phone": "Phone",
    "auth.creatingAccount": "Creating account...",
    "auth.createAccount": "Create account",
    "auth.haveAccount": "Already have an account?",
    "auth.checkEmail": "Check your email for a verification link.",
    "provider.title": "Grow your business on LINKO",
    "provider.subtitle": "Join Kuwait's trusted marketplace and get discovered by businesses actively looking for your services.",
    "provider.step1Title": "Create your profile",
    "provider.step1Desc": "Sign up and tell us about your business.",
    "provider.step2Title": "Get verified",
    "provider.step2Desc": "Our team reviews your profile before it goes live.",
    "provider.step3Title": "Receive requests",
    "provider.step3Desc": "Qualified businesses reach out directly to you.",
    "auth.modalHeadline": "Success starts here",
    "auth.modalPoint1": "Verified providers across Kuwait",
    "auth.modalPoint2": "Quality work done faster",
    "auth.modalPoint3": "Trusted by businesses across Kuwait",
    "auth.continueWith": "Continue with",
    "auth.orSignupEmail": "Or sign up using email",
    "auth.orLoginEmail": "Or log in using email",
    "auth.termsNote": "By joining, you agree to LINKO's Terms of Service and Privacy Policy.",
    "auth.comingSoon": "is coming soon",

    "status.SUBMITTED": "Submitted",
    "status.ACCEPTED": "Accepted",
    "status.IN_PROGRESS": "In progress",
    "status.COMPLETED": "Completed",
    "status.CLOSED": "Closed",
    "status.DECLINED": "Declined",
    "status.CANCELLED": "Cancelled",

    "req.requestService": "Request this service",
    "req.businessOnly": "You'll need a Business account to submit a request.",
    "req.formTitle": "Request this service",
    "req.formSubtitle": "Tell the provider what you need. They'll respond directly on LINKO.",
    "req.title": "Title",
    "req.titlePlaceholder": "e.g. Annual audit for FY2026",
    "req.description": "Description",
    "req.budget": "Budget (optional)",
    "req.requiredBy": "Required by (optional)",
    "req.yourDetails": "Your details",
    "req.yourDetailsHint": "We'll save these to your business profile.",
    "req.submit": "Submit request",
    "req.submitting": "Submitting…",

    "req.myRequests": "My requests",
    "req.myRequestsDesc": "Track every service request you've submitted.",
    "req.noRequests": "You haven't submitted any requests yet.",
    "req.reference": "Reference",
    "req.provider": "Provider",
    "req.business": "Business",
    "req.category": "Category",
    "req.status": "Status",
    "req.lastUpdated": "Last updated",
    "req.viewDetails": "View details",
    "req.backToRequests": "Back to my requests",
    "req.backToInbox": "Back to inbox",
    "req.backToAllRequests": "Back to all requests",

    "req.confirmCompletion": "Confirm completion",
    "req.confirmCompletionDesc": "Confirm the deliverables meet your expectations to close this request.",
    "req.confirming": "Confirming…",
    "req.cancelRequest": "Cancel request",
    "req.cancelling": "Cancelling…",

    "req.timeline": "Status timeline",
    "req.attachments": "Deliverables",
    "req.noAttachments": "No files uploaded yet.",
    "req.download": "Download",

    "req.inbox": "Request inbox",
    "req.inboxDesc": "Incoming service requests from businesses.",
    "req.noInboxRequests": "No requests yet.",
    "req.accept": "Accept",
    "req.accepting": "Accepting…",
    "req.decline": "Decline",
    "req.declining": "Declining…",
    "req.declineReason": "Reason for declining (shown to the business)",
    "req.confirmDecline": "Confirm decline",
    "req.cancel": "Cancel",
    "req.startWork": "Start work",
    "req.starting": "Starting…",
    "req.markComplete": "Mark as completed",
    "req.completing": "Completing…",
    "req.noteOptional": "Note (optional)",
    "req.addDeliverable": "Add a deliverable",
    "req.fileName": "File name",
    "req.fileUrl": "File URL",
    "req.addFile": "Add file",
    "req.adding": "Adding…",
    "req.readOnlyClosed": "This request is closed and read-only.",

    "req.adminAll": "All requests",
    "req.adminAllDesc": "Every service request across the platform.",
    "req.filterStatus": "Status",
    "req.filterCategory": "Category",
    "req.filterBusiness": "Business",
    "req.filterProvider": "Provider",
    "req.filterAll": "All",
    "req.applyFilters": "Apply filters",
    "req.closeRequest": "Close request",
    "req.closeReason": "Reason for closing (logged in the timeline)",
    "req.confirmClose": "Confirm close",
    "req.closing": "Closing…",
    "req.noResults": "No requests match these filters.",
  },
  ar: {
    "nav.explore": "\u0627\u0633\u062a\u0643\u0634\u0641",
    "nav.allProviders": "\u062c\u0645\u064a\u0639 \u0645\u0632\u0648\u062f\u064a \u0627\u0644\u062e\u062f\u0645\u0629",
    "nav.becomeProvider": "\u0643\u0646 \u0645\u0632\u0648\u062f \u062e\u062f\u0645\u0629",
    "nav.login": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "nav.join": "\u0627\u0646\u0636\u0645",
    "nav.menu": "\u0627\u0644\u0642\u0627\u0626\u0645\u0629",
    "nav.closeMenu": "\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0642\u0627\u0626\u0645\u0629",
    "lang.english": "\u0627\u0644\u0625\u0646\u062c\u0644\u064a\u0632\u064a\u0629",
    "lang.arabic": "\u0627\u0644\u0639\u0631\u0628\u064a\u0629",
    "hero.title1": "\u0633\u0648\u0642 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0648\u062b\u0648\u0642",
    "hero.title2": "\u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a",
    "hero.subtitle": "\u0627\u0639\u062b\u0631 \u0639\u0644\u0649 \u0645\u0632\u0648\u062f\u064a \u062e\u062f\u0645\u0627\u062a \u0645\u062d\u0627\u0633\u0628\u0629 \u0648\u0642\u0627\u0646\u0648\u0646 \u0648\u062a\u0642\u0646\u064a\u0629 \u0648\u062a\u0633\u0648\u064a\u0642 \u0645\u0648\u062b\u0648\u0642\u064a\u0646 \u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a\u060c \u062a\u062a\u0645 \u0645\u0631\u0627\u062c\u0639\u062a\u0647\u0645 \u062c\u0645\u064a\u0639\u0627 \u0642\u0628\u0644 \u0638\u0647\u0648\u0631\u0647\u0645.",
    "search.placeholder": "\u0627\u0628\u062d\u062b \u0639\u0646 \u0623\u064a \u062e\u062f\u0645\u0629...",
    "search.button": "\u0628\u062d\u062b",
    "hero.footer": "\u064a\u062a\u0645 \u0645\u0631\u0627\u062c\u0639\u0629 \u0643\u0644 \u0645\u0632\u0648\u062f \u062e\u062f\u0645\u0629 \u0641\u064a \u0644\u064a\u0646\u0643\u0648 \u0648\u0627\u0644\u062a\u062d\u0642\u0642 \u0645\u0646\u0647 \u0642\u0628\u0644 \u0646\u0634\u0631\u0647.",
    "category.accounting": "\u0627\u0644\u0645\u062d\u0627\u0633\u0628\u0629",
    "category.legal": "\u0627\u0644\u0642\u0627\u0646\u0648\u0646\u064a\u0629",
    "category.technology": "\u0627\u0644\u062a\u0643\u0646\u0648\u0644\u0648\u062c\u064a\u0627",
    "category.marketing": "\u0627\u0644\u062a\u0633\u0648\u064a\u0642",
    "category.government-pro-services": "\u0627\u0644\u062d\u0643\u0648\u0645\u064a\u0629 \u0648\u062e\u062f\u0645\u0627\u062a \u0627\u0644\u0639\u0644\u0627\u0642\u0627\u062a \u0627\u0644\u0639\u0627\u0645\u0629",
    "auth.loginTitle": "\u0645\u0631\u062d\u0628\u0627 \u0628\u0639\u0648\u062f\u062a\u0643",
    "auth.loginSubtitle": "\u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0625\u0644\u0649 \u062d\u0633\u0627\u0628\u0643 \u0641\u064a \u0644\u064a\u0646\u0643\u0648.",
    "auth.loginPanelTitle": "\u0645\u0631\u062d\u0628\u0627 \u0628\u0639\u0648\u062f\u062a\u0643 \u0625\u0644\u0649 \u0633\u0648\u0642 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0648\u062b\u0648\u0642 \u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a.",
    "auth.email": "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    "auth.password": "\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631",
    "auth.loginButton": "\u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644",
    "auth.loggingIn": "\u062c\u0627\u0631\u064a \u062a\u0633\u062c\u064a\u0644 \u0627\u0644\u062f\u062e\u0648\u0644...",
    "auth.noAccount": "\u0644\u064a\u0633 \u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628\u061f",
    "auth.registerLink": "\u0633\u062c\u0644 \u0627\u0644\u0622\u0646",
    "auth.registerTitle": "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
    "auth.registerSubtitle": "\u0627\u062e\u062a\u0631 \u0643\u064a\u0641 \u0633\u062a\u0633\u062a\u062e\u062f\u0645 \u0644\u064a\u0646\u0643\u0648.",
    "auth.registerPanelTitle": "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0633\u0648\u0642 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0648\u062b\u0648\u0642 \u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a.",
    "auth.roleBusiness": "\u0634\u0631\u0643\u0629",
    "auth.roleBusinessHint": "\u0627\u0628\u062d\u062b \u0639\u0646 \u0645\u0632\u0648\u062f\u064a \u062e\u062f\u0645\u0629",
    "auth.roleProvider": "\u0645\u0632\u0648\u062f \u062e\u062f\u0645\u0629",
    "auth.roleProviderHint": "\u0642\u062f\u0645 \u062e\u062f\u0645\u0627\u062a\u0643",
    "auth.companyName": "\u0627\u0633\u0645 \u0627\u0644\u0634\u0631\u0643\u0629",
    "auth.contactPerson": "\u0627\u0644\u0634\u062e\u0635 \u0627\u0644\u0645\u0633\u0624\u0648\u0644",
    "auth.workEmail": "\u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u0644\u0639\u0645\u0644",
    "auth.phone": "\u0631\u0642\u0645 \u0627\u0644\u0647\u0627\u062a\u0641",
    "auth.creatingAccount": "\u062c\u0627\u0631\u064a \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u062d\u0633\u0627\u0628...",
    "auth.createAccount": "\u0625\u0646\u0634\u0627\u0621 \u062d\u0633\u0627\u0628",
    "auth.haveAccount": "\u0644\u062f\u064a\u0643 \u062d\u0633\u0627\u0628 \u0628\u0627\u0644\u0641\u0639\u0644\u061f",
    "auth.checkEmail": "\u062a\u062d\u0642\u0642 \u0645\u0646 \u0628\u0631\u064a\u062f\u0643 \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a \u0644\u0644\u062d\u0635\u0648\u0644 \u0639\u0644\u0649 \u0631\u0627\u0628\u0637 \u0627\u0644\u062a\u0641\u0639\u064a\u0644.",
    "provider.title": "\u0637\u0648\u0631 \u0623\u0639\u0645\u0627\u0644\u0643 \u0645\u0639 \u0644\u064a\u0646\u0643\u0648",
    "provider.subtitle": "\u0627\u0646\u0636\u0645 \u0625\u0644\u0649 \u0633\u0648\u0642 \u0627\u0644\u0623\u0639\u0645\u0627\u0644 \u0627\u0644\u0645\u0648\u062b\u0648\u0642 \u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a \u0648\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0641\u0631\u0635 \u0645\u0646 \u0634\u0631\u0643\u0627\u062a \u062a\u0628\u062d\u062b \u0641\u0639\u0644\u064a\u0627 \u0639\u0646 \u062e\u062f\u0645\u0627\u062a\u0643.",
    "provider.step1Title": "\u0623\u0646\u0634\u0626 \u0645\u0644\u0641\u0643 \u0627\u0644\u0634\u062e\u0635\u064a",
    "provider.step1Desc": "\u0633\u062c\u0644 \u0648\u0623\u062e\u0628\u0631\u0646\u0627 \u0639\u0646 \u0646\u0634\u0627\u0637\u0643 \u0627\u0644\u062a\u062c\u0627\u0631\u064a.",
    "provider.step2Title": "\u0627\u062d\u0635\u0644 \u0639\u0644\u0649 \u0627\u0644\u062a\u0648\u062b\u064a\u0642",
    "provider.step2Desc": "\u064a\u0631\u0627\u062c\u0639 \u0641\u0631\u064a\u0642\u0646\u0627 \u0645\u0644\u0641\u0643 \u0642\u0628\u0644 \u0646\u0634\u0631\u0647 \u0644\u0644\u0639\u0627\u0645\u0629.",
    "provider.step3Title": "\u0627\u0633\u062a\u0642\u0628\u0644 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "provider.step3Desc": "\u062a\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0627\u0644\u0634\u0631\u0643\u0627\u062a \u0627\u0644\u0645\u0647\u062a\u0645\u0629 \u0645\u0628\u0627\u0634\u0631\u0629.",
    "auth.modalHeadline": "\u0627\u0628\u062f\u0623 \u0642\u0635\u0629 \u0646\u062c\u0627\u062d\u0643",
    "auth.modalPoint1": "\u0645\u0632\u0648\u062f\u0648 \u062e\u062f\u0645\u0629 \u0645\u0648\u062b\u0648\u0642\u0648\u0646 \u0641\u064a \u062c\u0645\u064a\u0639 \u0623\u0646\u062d\u0627\u0621 \u0627\u0644\u0643\u0648\u064a\u062a",
    "auth.modalPoint2": "\u0639\u0645\u0644 \u0639\u0627\u0644\u064a \u0627\u0644\u062c\u0648\u062f\u0629 \u0648\u0628\u0634\u0643\u0644 \u0623\u0633\u0631\u0639",
    "auth.modalPoint3": "\u0645\u0648\u062b\u0648\u0642 \u0645\u0646 \u0642\u0628\u0644 \u0627\u0644\u0634\u0631\u0643\u0627\u062a \u0641\u064a \u0627\u0644\u0643\u0648\u064a\u062a",
    "auth.continueWith": "\u0645\u062a\u0627\u0628\u0639\u0629 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645",
    "auth.orSignupEmail": "\u0623\u0648 \u0633\u062c\u0644 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    "auth.orLoginEmail": "\u0623\u0648 \u0633\u062c\u0644 \u0627\u0644\u062f\u062e\u0648\u0644 \u0628\u0627\u0633\u062a\u062e\u062f\u0627\u0645 \u0627\u0644\u0628\u0631\u064a\u062f \u0627\u0644\u0625\u0644\u0643\u062a\u0631\u0648\u0646\u064a",
    "auth.termsNote": "\u0628\u0627\u0644\u0627\u0646\u0636\u0645\u0627\u0645\u060c \u0641\u0625\u0646\u0643 \u062a\u0648\u0627\u0641\u0642 \u0639\u0644\u0649 \u0634\u0631\u0648\u0637 \u0627\u0644\u062e\u062f\u0645\u0629 \u0648\u0633\u064a\u0627\u0633\u0629 \u0627\u0644\u062e\u0635\u0648\u0635\u064a\u0629 \u0627\u0644\u062e\u0627\u0635\u0629 \u0628\u0644\u064a\u0646\u0643\u0648.",
    "auth.comingSoon": "\u0642\u0631\u064a\u0628\u0627",

    "status.SUBMITTED": "\u062a\u0645 \u0627\u0644\u0625\u0631\u0633\u0627\u0644",
    "status.ACCEPTED": "\u0645\u0642\u0628\u0648\u0644",
    "status.IN_PROGRESS": "\u0642\u064a\u062f \u0627\u0644\u062a\u0646\u0641\u064a\u0630",
    "status.COMPLETED": "\u0645\u0643\u062a\u0645\u0644",
    "status.CLOSED": "\u0645\u063a\u0644\u0642",
    "status.DECLINED": "\u0645\u0631\u0641\u0648\u0636",
    "status.CANCELLED": "\u0645\u0644\u063a\u0649",

    "req.requestService": "\u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629",
    "req.businessOnly": "\u0633\u062a\u062d\u062a\u0627\u062c \u0625\u0644\u0649 \u062d\u0633\u0627\u0628 \u0634\u0631\u0643\u0629 \u0644\u062a\u0642\u062f\u064a\u0645 \u0637\u0644\u0628.",
    "req.formTitle": "\u0637\u0644\u0628 \u0647\u0630\u0647 \u0627\u0644\u062e\u062f\u0645\u0629",
    "req.formSubtitle": "\u0623\u062e\u0628\u0631 \u0645\u0632\u0648\u062f \u0627\u0644\u062e\u062f\u0645\u0629 \u0628\u0645\u0627 \u062a\u062d\u062a\u0627\u062c\u0647. \u0633\u064a\u062a\u0648\u0627\u0635\u0644 \u0645\u0639\u0643 \u0645\u0628\u0627\u0634\u0631\u0629 \u0639\u0628\u0631 \u0644\u064a\u0646\u0643\u0648.",
    "req.title": "\u0627\u0644\u0639\u0646\u0648\u0627\u0646",
    "req.titlePlaceholder": "\u0645\u062b\u0627\u0644: \u062a\u062f\u0642\u064a\u0642 \u0633\u0646\u0648\u064a \u0644\u0644\u0633\u0646\u0629 \u0627\u0644\u0645\u0627\u0644\u064a\u0629 2026",
    "req.description": "\u0627\u0644\u0648\u0635\u0641",
    "req.budget": "\u0627\u0644\u0645\u064a\u0632\u0627\u0646\u064a\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "req.requiredBy": "\u0627\u0644\u0645\u0637\u0644\u0648\u0628 \u0625\u0646\u062c\u0627\u0632\u0647 \u0628\u062d\u0644\u0648\u0644 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "req.yourDetails": "\u0628\u064a\u0627\u0646\u0627\u062a\u0643",
    "req.yourDetailsHint": "\u0633\u0646\u062d\u0641\u0638 \u0647\u0630\u0647 \u0627\u0644\u0628\u064a\u0627\u0646\u0627\u062a \u0641\u064a \u0645\u0644\u0641 \u0634\u0631\u0643\u062a\u0643.",
    "req.submit": "\u0625\u0631\u0633\u0627\u0644 \u0627\u0644\u0637\u0644\u0628",
    "req.submitting": "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0631\u0633\u0627\u0644...",

    "req.myRequests": "\u0637\u0644\u0628\u0627\u062a\u064a",
    "req.myRequestsDesc": "\u062a\u0627\u0628\u0639 \u0643\u0644 \u0637\u0644\u0628 \u062e\u062f\u0645\u0629 \u0642\u0645\u062a \u0628\u0625\u0631\u0633\u0627\u0644\u0647.",
    "req.noRequests": "\u0644\u0645 \u062a\u0642\u0645 \u0628\u0625\u0631\u0633\u0627\u0644 \u0623\u064a \u0637\u0644\u0628\u0627\u062a \u0628\u0639\u062f.",
    "req.reference": "\u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0645\u0631\u062c\u0639\u064a",
    "req.provider": "\u0645\u0632\u0648\u062f \u0627\u0644\u062e\u062f\u0645\u0629",
    "req.business": "\u0627\u0644\u0634\u0631\u0643\u0629",
    "req.category": "\u0627\u0644\u0641\u0626\u0629",
    "req.status": "\u0627\u0644\u062d\u0627\u0644\u0629",
    "req.lastUpdated": "\u0622\u062e\u0631 \u062a\u062d\u062f\u064a\u062b",
    "req.viewDetails": "\u0639\u0631\u0636 \u0627\u0644\u062a\u0641\u0627\u0635\u064a\u0644",
    "req.backToRequests": "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0637\u0644\u0628\u0627\u062a\u064a",
    "req.backToInbox": "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "req.backToAllRequests": "\u0627\u0644\u0639\u0648\u062f\u0629 \u0625\u0644\u0649 \u062c\u0645\u064a\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",

    "req.confirmCompletion": "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u0646\u062c\u0627\u0632",
    "req.confirmCompletionDesc": "\u0623\u0643\u062f \u0623\u0646 \u0627\u0644\u0645\u062e\u0631\u062c\u0627\u062a \u062a\u0644\u0628\u064a \u062a\u0648\u0642\u0639\u0627\u062a\u0643 \u0644\u0625\u063a\u0644\u0627\u0642 \u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628.",
    "req.confirming": "\u062c\u0627\u0631\u064a \u0627\u0644\u062a\u0623\u0643\u064a\u062f...",
    "req.cancelRequest": "\u0625\u0644\u063a\u0627\u0621 \u0627\u0644\u0637\u0644\u0628",
    "req.cancelling": "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0644\u063a\u0627\u0621...",

    "req.timeline": "\u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a \u0644\u0644\u062d\u0627\u0644\u0629",
    "req.attachments": "\u0627\u0644\u0645\u062e\u0631\u062c\u0627\u062a",
    "req.noAttachments": "\u0644\u0645 \u064a\u062a\u0645 \u0631\u0641\u0639 \u0623\u064a \u0645\u0644\u0641\u0627\u062a \u0628\u0639\u062f.",
    "req.download": "\u062a\u0646\u0632\u064a\u0644",

    "req.inbox": "\u0635\u0646\u062f\u0648\u0642 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "req.inboxDesc": "\u0637\u0644\u0628\u0627\u062a \u0627\u0644\u062e\u062f\u0645\u0629 \u0627\u0644\u0648\u0627\u0631\u062f\u0629 \u0645\u0646 \u0627\u0644\u0634\u0631\u0643\u0627\u062a.",
    "req.noInboxRequests": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u0628\u0639\u062f.",
    "req.accept": "\u0642\u0628\u0648\u0644",
    "req.accepting": "\u062c\u0627\u0631\u064a \u0627\u0644\u0642\u0628\u0648\u0644...",
    "req.decline": "\u0631\u0641\u0636",
    "req.declining": "\u062c\u0627\u0631\u064a \u0627\u0644\u0631\u0641\u0636...",
    "req.declineReason": "\u0633\u0628\u0628 \u0627\u0644\u0631\u0641\u0636 (\u064a\u0638\u0647\u0631 \u0644\u0644\u0634\u0631\u0643\u0629)",
    "req.confirmDecline": "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0631\u0641\u0636",
    "req.cancel": "\u0625\u0644\u063a\u0627\u0621",
    "req.startWork": "\u0628\u062f\u0621 \u0627\u0644\u0639\u0645\u0644",
    "req.starting": "\u062c\u0627\u0631\u064a \u0627\u0644\u0628\u062f\u0621...",
    "req.markComplete": "\u0648\u0636\u0639 \u0639\u0644\u0627\u0645\u0629 \u0645\u0643\u062a\u0645\u0644",
    "req.completing": "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0643\u0645\u0627\u0644...",
    "req.noteOptional": "\u0645\u0644\u0627\u062d\u0638\u0629 (\u0627\u062e\u062a\u064a\u0627\u0631\u064a)",
    "req.addDeliverable": "\u0625\u0636\u0627\u0641\u0629 \u0645\u062e\u0631\u062c",
    "req.fileName": "\u0627\u0633\u0645 \u0627\u0644\u0645\u0644\u0641",
    "req.fileUrl": "\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0644\u0641",
    "req.addFile": "\u0625\u0636\u0627\u0641\u0629 \u0645\u0644\u0641",
    "req.adding": "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u0636\u0627\u0641\u0629...",
    "req.readOnlyClosed": "\u0647\u0630\u0627 \u0627\u0644\u0637\u0644\u0628 \u0645\u063a\u0644\u0642 \u0648\u0644\u0644\u0642\u0631\u0627\u0621\u0629 \u0641\u0642\u0637.",

    "req.adminAll": "\u062c\u0645\u064a\u0639 \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "req.adminAllDesc": "\u0643\u0644 \u0637\u0644\u0628 \u062e\u062f\u0645\u0629 \u0639\u0628\u0631 \u0627\u0644\u0645\u0646\u0635\u0629.",
    "req.filterStatus": "\u0627\u0644\u062d\u0627\u0644\u0629",
    "req.filterCategory": "\u0627\u0644\u0641\u0626\u0629",
    "req.filterBusiness": "\u0627\u0644\u0634\u0631\u0643\u0629",
    "req.filterProvider": "\u0645\u0632\u0648\u062f \u0627\u0644\u062e\u062f\u0645\u0629",
    "req.filterAll": "\u0627\u0644\u0643\u0644",
    "req.applyFilters": "\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0641\u0644\u0627\u062a\u0631",
    "req.closeRequest": "\u0625\u063a\u0644\u0627\u0642 \u0627\u0644\u0637\u0644\u0628",
    "req.closeReason": "\u0633\u0628\u0628 \u0627\u0644\u0625\u063a\u0644\u0627\u0642 (\u064a\u064f\u0633\u062c\u0644 \u0641\u064a \u0627\u0644\u062c\u062f\u0648\u0644 \u0627\u0644\u0632\u0645\u0646\u064a)",
    "req.confirmClose": "\u062a\u0623\u0643\u064a\u062f \u0627\u0644\u0625\u063a\u0644\u0627\u0642",
    "req.closing": "\u062c\u0627\u0631\u064a \u0627\u0644\u0625\u063a\u0644\u0627\u0642...",
    "req.noResults": "\u0644\u0627 \u062a\u0648\u062c\u062f \u0637\u0644\u0628\u0627\u062a \u0645\u0637\u0627\u0628\u0642\u0629 \u0644\u0647\u0630\u0647 \u0627\u0644\u0641\u0644\u0627\u062a\u0631.",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  dir: "ltr" | "rtl";
  t: (key: TranslationKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = window.localStorage.getItem("linko-lang") as Lang | null;
    if (stored === "ar" || stored === "en") setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem("linko-lang", lang);
  }, [lang]);

  function setLang(next: Lang) {
    setLangState(next);
  }

  function t(key: TranslationKey) {
    return translations[lang][key] || translations.en[key] || key;
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, dir: lang === "ar" ? "rtl" : "ltr", t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
