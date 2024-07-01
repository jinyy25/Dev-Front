export const navigation = [
  {
    text: 'Home',
    path: '/home',
    icon: 'home'
  },
  {
    text: '공지사항',
    path: '/notice',
    icon: 'description'
  },
  {
    text: '자료검색',
    icon: 'search',
    items: [
      {
        text: '회사자료',
        path: '/search',
      },
        {
          text: '참고자료',
          path: '/reference'
        },
      {
        text: '동영상자료',
        path: '/record'
      }
    ]
  },
  {
    text: '승인처리',
    icon: 'datapie',
    items: [
      {
        text: '반출승인',
        path: '/approval',
      },
      {
        text: '승인요청현황',
        path: '/approval/requeststatus'
      },
      {
        text: '승인처리현황',
        path: '/approval/status'
      }
    ]
  },
  {
    text: '자료통계',
    icon: 'datausage',
    items: [
      {
        text: '파일등록현황',
        path: '/docs',
      },
      {
        text: '개인별승인',
        path: '/person'
      },
      {
        text: '자료별승인',
        path: '/file'
      },
      {
        text: '접속사용자별',
        path: '/user'
      },
      {
        text: '접속요일별',
        path: '/week'
      },
      {
        text: '접속시간대별',
        path: '/time'
      },
      {
        text: '다운로드현황',
        path: '/download'
      },
      {
        text: '마일리지현황',
        path: '/mileage'
      }
    ]
  },
  {
    text: '기준정보',
    icon: 'preferences',
    items: [
      {
        text: '권한설정',
        path: '/setting'
      }
    ]
  }
  ];
