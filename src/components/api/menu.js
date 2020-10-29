export const menus = [
    {
      name: "Dashboard",
      roles: ["m", "ad", "sa"],
      key: "dashboard",
      child: [
        {
          name: "My Projects",
          link: "/app/translations/projects",
          roles: ["m", "ad", "sa"],
          key: "my_projects",
        },
        {
          name: "Available Sources",
          link: "/app/translations/sources",
          roles: ["m", "ad", "sa"],
          key: "sources",
        },
        {
          name: "Create Organisation",
          link: "/app/organisations/create",
          roles: ["m", "sa"],
          key: "create_organisations",
        },
        {
          name: "Verify Organisation",
          link: "/app/organisations",
          roles: ["member", "admin", "sa"],
          key: "organisations",
        },
        {
          name: "Assign Projects",
          link: "/app/projects",
          roles: ["member", "ad", "sa"],
          key: "projects",
        },
        {
          name: "Verify Users",
          link: "/app/users",
          roles: ["member", "admin", "sa"],
          key: "users",
        },

        {
          name: 'Reports Dashboard',
          link: '/app/report',
          roles: ['ad','sa'],
          key: 'report'
      },
      ],
    },
    
    // {
    //     name: 'Translations',
    //     roles: ['m', 'ad', 'sa'],
    //     key: 'translations',
    //     child: [
    //         {
    //             name: 'Sources',
    //             link: '/app/translations/sources',
    //             roles: ['m', 'ad', 'sa'],
    //             key: 'sources'
    //         },
    //         {
    //             name: 'My projects',
    //             link: '/app/translations/projects',
    //             roles: ['m', 'ad', 'sa'],
    //             key: 'my_projects'
    //         },
    //     ]
    // },
  ];
  
