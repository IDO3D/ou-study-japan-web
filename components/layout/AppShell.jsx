// components/layout/AppShell.jsx
import { useState, useEffect } from 'react'
import Navigation from './Navigation'
import Header from './Header'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'

export default function AppShell({ children, currentView, onNavigate }) {
  return (
    <div
      id="app-shell"
      className="relative flex flex-col md:flex-row overflow-hidden w-full h-full"
      style={{
        background: 'radial-gradient(ellipse at 20% 10%, rgba(224,36,36,0.08) 0%, transparent 50%), #09090b',
      }}
    >
      <Sidebar currentView={currentView} onNavigate={onNavigate} />

      <div className="flex-1 flex flex-col relative overflow-hidden h-full">
        {/* Mobile Header */}
        <div className="md:hidden">
          <Header currentView={currentView} />
        </div>

        {/* Main Content Area */}
        <main
          className="flex-1 overflow-y-auto hide-scroll flex justify-center pb-[6.5rem] md:pb-0"
        >
          <div className="container relative h-full flex flex-col pt-24 pb-28 md:pt-8 md:pb-8 max-w-5xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      <RightPanel currentView={currentView} />

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Navigation currentView={currentView} onNavigate={onNavigate} />
      </div>
    </div>
  )
}
