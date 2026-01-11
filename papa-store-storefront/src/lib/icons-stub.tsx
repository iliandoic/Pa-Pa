"use client"

// Stub for @medusajs/icons
// Simple SVG icon placeholders

import React, { SVGProps } from "react"

type IconProps = SVGProps<SVGSVGElement>

// Helper to create icon components
const createIcon = (path: React.ReactNode, displayName: string) => {
  const Icon = (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      width="1em"
      height="1em"
      {...props}
    >
      {path}
    </svg>
  )
  Icon.displayName = displayName
  return Icon
}

const createSolidIcon = (path: React.ReactNode, displayName: string) => {
  const Icon = (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      {...props}
    >
      {path}
    </svg>
  )
  Icon.displayName = displayName
  return Icon
}

// Arrow icons
export const ArrowUpRightMini = createIcon(
  <path d="M7 17L17 7M17 7H7M17 7V17" />,
  "ArrowUpRightMini"
)

export const ArrowRightMini = createIcon(
  <path d="M5 12h14M12 5l7 7-7 7" />,
  "ArrowRightMini"
)

export const ArrowRightOnRectangle = createIcon(
  <>
    <path d="M17 16l4-4m0 0l-4-4m4 4H7" />
    <path d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0z" opacity={0.3} />
  </>,
  "ArrowRightOnRectangle"
)

// X / Close icons
export const XMark = createIcon(
  <path d="M6 18L18 6M6 6l12 12" />,
  "XMark"
)

export const XCircleSolid = createSolidIcon(
  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clipRule="evenodd" />,
  "XCircleSolid"
)

// Check icons
export const CheckCircleSolid = createSolidIcon(
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />,
  "CheckCircleSolid"
)

export const CheckCircleMiniSolid = createSolidIcon(
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />,
  "CheckCircleMiniSolid"
)

// Credit card
export const CreditCard = createIcon(
  <>
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </>,
  "CreditCard"
)

// Plus
export const Plus = createIcon(
  <path d="M12 5v14M5 12h14" />,
  "Plus"
)

// Edit / Pencil
export const PencilSquare = createIcon(
  <>
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
  </>,
  "PencilSquare"
)
export const Edit = PencilSquare

// Trash
export const Trash = createIcon(
  <>
    <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    <line x1="10" y1="11" x2="10" y2="17" />
    <line x1="14" y1="11" x2="14" y2="17" />
  </>,
  "Trash"
)

// Chevron
export const ChevronUpDown = createIcon(
  <path d="M7 15l5 5 5-5M7 9l5-5 5 5" />,
  "ChevronUpDown"
)

// Loader / Spinner
export const Loader = (props: IconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    width="1em"
    height="1em"
    className="animate-spin"
    {...props}
  >
    <path d="M21 12a9 9 0 11-6.219-8.56" />
  </svg>
)
Loader.displayName = "Loader"

export const Spinner = Loader

// Exclamation / Warning
export const ExclamationCircleSolid = createSolidIcon(
  <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />,
  "ExclamationCircleSolid"
)

// Github
export const Github = createIcon(
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />,
  "Github"
)

// Bag / Shopping
export const BagShopping = createIcon(
  <>
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </>,
  "BagShopping"
)

// User
export const User = createIcon(
  <>
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </>,
  "User"
)

// Menu / Bars
export const Bars3 = createIcon(
  <>
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </>,
  "Bars3"
)

// Map pin
export const MapPin = createIcon(
  <>
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </>,
  "MapPin"
)

// Package / Box
export const Package = createIcon(
  <>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </>,
  "Package"
)

// Receipt
export const ReceiptPercent = createIcon(
  <>
    <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1z" />
    <path d="M9 10l6 4M15 10l-6 4" />
  </>,
  "ReceiptPercent"
)

// Buildings
export const BuildingStorefront = createIcon(
  <>
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </>,
  "BuildingStorefront"
)

// Computer desktop
export const ComputerDesktop = createIcon(
  <>
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </>,
  "ComputerDesktop"
)

export default {
  ArrowUpRightMini,
  ArrowRightMini,
  ArrowRightOnRectangle,
  XMark,
  XCircleSolid,
  CheckCircleSolid,
  CheckCircleMiniSolid,
  CreditCard,
  Plus,
  PencilSquare,
  Edit,
  Trash,
  ChevronUpDown,
  Loader,
  Spinner,
  ExclamationCircleSolid,
  Github,
  BagShopping,
  User,
  Bars3,
  MapPin,
  Package,
  ReceiptPercent,
  BuildingStorefront,
  ComputerDesktop,
}
