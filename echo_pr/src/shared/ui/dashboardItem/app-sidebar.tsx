"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@shared/ui/dashboardItem/nav-main"
import { NavProjects } from "@shared/ui/dashboardItem/nav-projects"
import { NavUser } from "@shared/ui/dashboardItem/nav-user"
import { TeamSwitcher } from "@shared/ui/dashboardItem/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/shared/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/",
  },
  teams: [
    {
      name: "ECHO RP project",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
  navMain: [
    {
      title: "История",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Статистика",
          url: "#",
        },
        {
          title: "Анализ",
          url: "#",
        },
      ],
    },
   
    {
      title: "Документация",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
      ],
    },
    {
      title: "Настройки",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Главное",
          url: "#",
        },
        {
          title: "Поддержка",
          url: "#",
        },
        {
          title: "Оплата",
          url: "#",
        },
      ],
    },
  ],
  projects: [
 
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
