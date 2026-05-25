import { Breadcrumbs, BreadcrumbsItem } from "@heroui/react";

interface Breadcrumb {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 py-8">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs>
          {breadcrumbs.map((breadcrumb, index) => (
            <BreadcrumbsItem key={index} href={breadcrumb.href} className="text-foreground">
              {breadcrumb.label}
            </BreadcrumbsItem>
          ))}
        </Breadcrumbs>
      )}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        {description && <p className="text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}
