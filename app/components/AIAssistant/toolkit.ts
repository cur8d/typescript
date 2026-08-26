import { defineToolkit } from "@assistant-ui/react";
import { DocSearchTool } from "@/components/AIAssistant/tools/DocSearchTool";
import { ThemeTool } from "@/components/AIAssistant/tools/ThemeTool";
import { SystemInfoTool } from "@/components/AIAssistant/tools/SystemInfoTool";
import { NavigatePageTool } from "@/components/AIAssistant/tools/NavigatePageTool";

export const assistantToolkit = defineToolkit({
  searchDocumentation: {
    render: DocSearchTool,
  },
  setTheme: {
    render: ThemeTool,
  },
  getSystemInfo: {
    render: SystemInfoTool,
  },
  navigatePage: {
    render: NavigatePageTool,
  },
});

export default assistantToolkit;

