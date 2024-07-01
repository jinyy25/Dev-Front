import {
    HomePage,
    TasksPage,
    ProfilePage,
    WeekdayPage,
    ViewSettingPage,
    ApprovalRequestStatusPage,
    DownloadPage,
    MileagePage
} from './pages';
import { SearchPage,RecordPage }            from './pages';
import { ApprovalPage,ApprovalStatusPage }  from './pages';
import { NoticePage,ReferencePage }         from './pages';
import { DocsRegistrationPage,IndividualApprovalPage,FileApprovalPage,UserConnectivityPage,HourlyPage}                         from './pages';
import { AuthorizationSettingPage }         from './pages';

import { ViewFilePage,ViewPdfPage }         from './pages';
import { ViewReocordPage}                   from './pages';
import { ViewNoticePage}                    from './pages';

import { UploadNoticePage}                  from './pages';
import { UploadReferencePage}               from './pages';
import { UploadRecordPage}               from './pages';
import { ManagementReferencePage}           from './pages';

import { ViewReferencePage}           from './pages';

import { withNavigationWatcher }            from './contexts/navigation';
import ViewLayout from "./pages/search/view/view-layout";



const routes = [
    {
        path: '/task',
        element: TasksPage
    },
    {
        path: '/profile',
        element: ProfilePage
    },
    {
        path: '/home',
        element: HomePage
    },

    /*자료검색*/
    {
        path: '/search',
        element: SearchPage
    },
    {
        path: '/record',
        element: RecordPage
    },

    /*승인처리*/
    {
        path: '/approval',
        element: ApprovalPage
    },
    {
        path: '/approval/status',
        element: ApprovalStatusPage
    },
    {
        path: '/approval/requeststatus',
        element: ApprovalRequestStatusPage
    },

    /*참고자료*/
    {
        path: '/notice',
        element: NoticePage
    },
    {
        path: '/reference',
        element: ReferencePage
    },

    /*자료통계*/
    {
        path: '/docs',
        element: DocsRegistrationPage
    },
    {
        path: '/person',
        element: IndividualApprovalPage
    },
    {
        path: '/file',
        element: FileApprovalPage
    },
    {
        path: '/user',
        element: UserConnectivityPage
    },
    {
        path: '/week',
        element: WeekdayPage
    },
    {
        path: '/time',
        element: HourlyPage
    },
    {
        path: '/download',
        element: DownloadPage
    },
    {
        path: '/mileage',
        element: MileagePage
    },

    // Setting
    {
        path: '/setting',
        element: AuthorizationSettingPage
    },

    {
        path: '/viewsetting',
        element: ViewSettingPage
    },


    //fileview
    {
        path: '/viewfile',
        element: ViewLayout
    },
    {
        path: '/viewpdf',
        element: ViewPdfPage
    },

    //recordview
    {
        path: '/viewrecord',
        element: ViewReocordPage
    },
    {
        path: '/viewnotice',
        element: ViewNoticePage
    },
    {
        path: '/uploadnotice',
        element: UploadNoticePage
    },
    {
        path: '/reference/management',
        element: ManagementReferencePage
    },
    {
        path: '/reference/upload',
        element: UploadReferencePage
    },
    {
        path: '/record/upload',
        element: UploadRecordPage
    },
    {
        path: '/reference/view',
        element: ViewReferencePage
    }
];

export default routes.map(route => {
    return {
        ...route,
        element: withNavigationWatcher(route.element, route.path)
    };
});
