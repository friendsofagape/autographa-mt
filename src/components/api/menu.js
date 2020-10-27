export const menus = [
    {
        name: 'Dashboard',
        roles: ['m', 'ad', 'sa'],
        key:'dashboard',
        child: [
            {
                name: 'List organisation',
                link: '/app/organisations',
                roles: ['member', 'admin', 'sa'],
                key:'organisations'
            },
            {
                name: 'List projects',
                link: '/app/projects',
                roles: ['member', 'ad', 'sa'],
                key: 'projects'
            },
            {
                name: 'List users',
                link: '/app/users',
                roles: ['member', 'admin', 'sa'],
                key: 'users'
            },
            {
                name: 'Create Organisation',
                link: '/app/organisations/create',
                roles: ['m', 'sa'],
                key: 'create_organisations'
            },
            {
                name: 'Source Languages',
                link: '/app/translations/sources',
                roles: ['m', 'ad', 'sa'],
                key: 'sources'
            },
            {
                name: 'My projects',
                link: '/app/translations/projects',
                roles: ['m', 'ad', 'sa'],
                key: 'my_projects'
            },
            {
                name: 'Reports Dashboard',
                link: '/app/report',
                roles: ['ad','sa'],
                key: 'report'
            },
        ]
    },
]