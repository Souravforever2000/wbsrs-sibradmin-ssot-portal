# WbsrsSibradminSsotPortal

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.16.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.

## WBSSOT frontend implementation

The Angular 20 frontend now provides a complete API-ready application foundation for the SIBRADADMIN/SRS master registry. It includes:

- Executive Overview with KPI cards, dynamic highlights, grade distribution, scheme match status, discrepancy frequency, confidence spectrum, and district performance.
- Global financial-year, district and scheme filters with reset behavior.
- Member Master Directory with debounced-search-ready UI, data-grade/status filtering, masked identifiers, empty state, and server-pagination-shaped table controls.
- Lazy routes for dashboard, analytics/growth/trends, geography, schemes, match workbench, fuzzy matching, data audit, citizens, Citizen 360, gap analysis, reports, alerts, administration and the controlled analytics assistant.
- Login screen, local demo identity, role/permission guards, HTTP client provider and API interceptor.
- Shared `GlobalFiltersComponent`, `KpiCardComponent`, `PageHeadingComponent`, `OperationalWorkspacePage` and `FilterStateService`.
- Layout shell built from `src/app/layouts/header`, `sidebar`, `navbar`, `main-layout` and `footer`; the sidebar is collapsible and groups all dashboard modules beneath `Dashboard`.
- Chart.js line and horizontal bar visualizations in `src/app/features/dashboard/components/dashboard-charts`.
- Reusable `SearchBoxComponent` moved into `src/app/shared/components/search-box`.
- Branding, icon sprite and font hand-off assets under `src/app/assets` and copied to the production `assets/` directory.
- A responsive, desktop-first visual system matching the supplied reference screens without adding a charting dependency.

The records in the dashboard and citizen services are intentionally demo fixtures. Replace them with an API-backed store before connecting production citizen data. The API boundary should keep the browser on aggregate endpoints for charts and use server-side pagination for citizens:

```text
GET /api/dashboard/summary?year=2025-26&districtId=...
GET /api/dashboard/matches?year=2025-26&schemeId=...
GET /api/citizens?page=0&size=25&search=...&districtId=...
GET /api/citizens/{uid}
```

Recommended production delivery sequence:

1. Define the summary, match-run and paginated citizen response contracts with the backend team.
2. Replace the mock methods in `DashboardService` and `CitizenService` with `ApiService` calls; keep chart aggregation on API/materialized views.
3. Add authentication, an HTTP interceptor and RBAC guards before exposing unmasked citizen fields or exports.
4. Split the module landing views into lazy-loaded `dashboard`, `citizens`, `schemes`, `gap-analysis`, `reports` and `administration` feature routes.
5. Add API contract tests, pagination/filter tests, RBAC tests and a browser E2E smoke test for the two primary screens.

Run `npm.cmd run build` to verify a production build, or `npm.cmd start` to preview the dashboard locally.

### Route map

| Route | Purpose | Access |
| --- | --- | --- |
| `/` | Redirects to the executive overview | Authenticated shell |
| `/dashboard` | Routed executive overview | Authenticated |
| `/analytics`, `/analytics/growth`, `/analytics/trends` | Growth and trend analysis | Authenticated |
| `/geography` | District/block ranking and drill-down entry | Authenticated |
| `/schemes`, `/schemes/compare` | Scheme performance and comparison | Authenticated |
| `/citizens`, `/citizens/:uid` | Server-paginated explorer and Citizen 360 | Authenticated |
| `/gap-analysis`, `/alerts` | Measured gaps and exceptions | Authenticated |
| `/reports` | Controlled report output workspace | Authenticated + export permission in API |
| `/administration`, `/administration/audit` | Users, roles and audit events | Admin roles |
| `/assistant` | API-grounded analytics assistant | Authenticated |

The UI uses demo data so it can be reviewed without backend credentials. Sensitive identifiers remain masked. The backend must enforce RBAC, geography restrictions, rate limits, server-side pagination, export authorization and audit logging independently of these client guards.
