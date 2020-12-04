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
          name: "Request Admin Permission",
          link: "/app/organisations/create",
          roles: ["m"],
          key: "create_organisations",
        },
        {
          name: "Verify Admin Request",
          link: "/app/organisations",
          roles: ["sa"],
          key: "organisations",
        },
        {
          name: "Create/Assign Projects",
          link: "/app/projects",
          roles: ["member", "ad", "sa"],
          key: "projects",
        },
        {
          name: "Change User Roles",
          link: "/app/users",
          roles: ["sa"],
          key: "users",
        },

        {
          name: 'Reports Dashboard',
          link: '/app/report',
          roles: ['ad','sa'],
          key: 'report'
      },
      {
        name: 'User Details',
        link: '/app/roleDetails',
        roles: ['ad','sa', 'm'],
        key: 'report'
    }
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
  
