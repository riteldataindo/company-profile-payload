import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { NextResponse } from 'next/server'

function lexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map(p => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, version: 1 }],
        version: 1,
      })),
      direction: 'ltr', format: '', indent: 0, version: 1,
    },
  }
}

const FEATURE_NAMES: Record<string, Record<string, { name: string; desc: string }>> = {
  ko: {
    1: { name: '방문자 트래픽', desc: 'AI 기반 CCTV 분석으로 매장에 출입하는 모든 방문자를 추적 — 99.9% 정확도의 실시간 카운팅.' },
    2: { name: '입출 트래픽', desc: '모든 출입구에서 입장과 퇴장을 분리하여 순 방문자 수 계산.' },
    3: { name: '체류 시간', desc: '특정 구역에서 방문자가 머무는 시간 측정 — 인기 구역과 비인기 구역 파악.' },
    4: { name: '통행인', desc: '매장 앞을 지나가는 사람과 실제 입장하는 사람을 비교 — 매장 매력도 측정.' },
    5: { name: '입장률', desc: '통행인 중 매장에 들어오는 비율 계산 — 쇼윈도 디스플레이와 간판 최적화.' },
    6: { name: '그룹률', desc: '방문자 그룹과 개인 감지 — 쇼핑 행동 패턴 파악.' },
    7: { name: '인구 통계', desc: '개인정보를 저장하지 않는 프라이버시 준수 연령 및 성별 추정 — 100% 규정 준수.' },
    8: { name: '재실 인원', desc: '설정 가능한 임계값과 알림을 통한 실시간 재실 인원 모니터링.' },
    9: { name: '서비스 효율', desc: '방문자 트래픽과 직원 현황을 결합하여 서비스 수준 측정 및 최적화.' },
    10: { name: '히트맵', desc: '매장 전체 방문자 이동 패턴 시각화 — 핫존 파악 및 제품 배치 최적화.' },
    11: { name: '대기열', desc: '실시간 대기열 길이 모니터링 및 대기 시간 추정 — 대기열이 길어지기 전 알림.' },
    12: { name: '매장 내 동선', desc: '방문자가 매장 내에서 가장 많이 이동하는 경로 추적 — 전환율 최적화를 위한 레이아웃 개선.' },
  },
  ja: {
    1: { name: '来店客数', desc: 'AI搭載のCCTV分析で来店するすべての訪問者を追跡 — 99.9%の精度でリアルタイムカウント。' },
    2: { name: '入退店トラフィック', desc: 'すべての入口で入店と退店を分けて純訪問者数を計算。' },
    3: { name: '滞在時間', desc: '特定ゾーンでの訪問者の滞在時間を測定 — エンゲージメントの高い場所と低い場所を特定。' },
    4: { name: '通行人', desc: '店舗前を通過する人と入店する人を比較 — 店頭の集客力を測定。' },
    5: { name: '入店率', desc: '通行人のうち入店する割合を計算 — ウィンドウディスプレイと看板の最適化。' },
    6: { name: 'グループ率', desc: '訪問者グループと個人を検出 — 買い物行動パターンの把握。' },
    7: { name: '人口統計', desc: '個人データを保存しないプライバシー準拠の年齢・性別推定 — 100%規制準拠。' },
    8: { name: '在館人数', desc: '設定可能な閾値とアラートによるリアルタイム在館人数モニタリング。' },
    9: { name: 'サービス効率', desc: '来店客数とスタッフ状況を組み合わせてサービスレベルを測定・最適化。' },
    10: { name: 'ヒートマップ', desc: '店舗全体の訪問者移動パターンを可視化 — ホットゾーンの特定と商品配置の最適化。' },
    11: { name: '待ち行列', desc: 'リアルタイムの待ち行列長モニタリングと待ち時間推定 — 列が長くなる前にアラート。' },
    12: { name: '店内動線', desc: '訪問者が店内で最も多く通る経路を追跡 — コンバージョン最適化のためのレイアウト改善。' },
  },
  zh: {
    1: { name: '访客流量', desc: '使用AI驱动的CCTV分析追踪每位进出店铺的访客 — 99.9%准确率的实时计数。' },
    2: { name: '进出流量', desc: '在所有入口分别统计进出人数，计算净访客量。' },
    3: { name: '停留时间', desc: '测量访客在特定区域的停留时间 — 识别热点区域和冷门区域。' },
    4: { name: '路过行人', desc: '比较经过店铺的行人与实际进店的人数 — 衡量店面吸引力。' },
    5: { name: '进店率', desc: '计算路过行人中进店的比例 — 优化橱窗展示和标识。' },
    6: { name: '团体率', desc: '检测访客群组与个人 — 了解购物行为模式。' },
    7: { name: '人口统计', desc: '不存储个人数据的隐私合规年龄和性别估计 — 100%符合法规。' },
    8: { name: '在场人数', desc: '具有可配置阈值和警报的实时在场人数监控。' },
    9: { name: '服务效率', desc: '将访客流量与员工配置相结合，衡量和优化服务水平。' },
    10: { name: '热力图', desc: '可视化店铺内访客移动模式 — 识别热点区域并优化商品摆放。' },
    11: { name: '排队管理', desc: '实时排队长度监控和等待时间估算 — 在排队过长之前发出警报。' },
    12: { name: '店内路线', desc: '追踪访客在店内最常走的路径 — 优化布局以提高转化率。' },
  },
}

const USECASE_NAMES: Record<string, Record<string, { name: string; desc: string }>> = {
  ko: {
    1: { name: '소매점', desc: '방문자 분석으로 모든 매장 위치 최적화 — 전환율, 재실 인원, 직원 효율 추적.' },
    2: { name: '쇼핑몰', desc: '테넌트 벤치마킹, 구역 최적화, 매출 기반 임대를 위한 몰 전체 트래픽 분석.' },
    3: { name: '패션 리테일', desc: '피팅룸 전환 추적, 컬렉션 성과 분석, 시즌별 트래픽 패턴.' },
    4: { name: '약국', desc: '처방전 카운터 대기열 모니터링, 약사 스케줄링 최적화, 상담 구역 추적.' },
    5: { name: '슈퍼마켓', desc: '통로별 트래픽 히트맵, 계산대 대기열 관리, 셀프 계산대 도입 추적.' },
    6: { name: '럭셔리 리테일', desc: '프리미엄 리테일을 위한 프라이버시 우선 인구통계 인사이트 및 VIP 트래픽 패턴 분석.' },
  },
  ja: {
    1: { name: '小売店', desc: '来店分析ですべての店舗を最適化 — コンバージョン率、在館人数、スタッフ効率を追跡。' },
    2: { name: 'ショッピングモール', desc: 'テナントベンチマーキング、ゾーン最適化、売上ベースのリースのためのモール全体のトラフィック分析。' },
    3: { name: 'ファッションリテール', desc: 'フィッティングルームのコンバージョン追跡、コレクションパフォーマンス分析、季節別トラフィックパターン。' },
    4: { name: '薬局', desc: '処方カウンターの待ち行列モニタリング、薬剤師のスケジューリング最適化、相談エリアの追跡。' },
    5: { name: 'スーパーマーケット', desc: '通路別トラフィックヒートマップ、レジ待ち行列管理、セルフレジ導入追跡。' },
    6: { name: 'ラグジュアリーリテール', desc: 'プレミアムリテール向けプライバシーファーストの人口統計インサイトとVIPトラフィックパターン分析。' },
  },
  zh: {
    1: { name: '零售店', desc: '通过访客分析优化每个门店 — 追踪转化率、在场人数和员工效率。' },
    2: { name: '购物中心', desc: '用于租户基准测试、区域优化和基于收入的租赁的全商场流量分析。' },
    3: { name: '时装零售', desc: '试衣间转化追踪、系列产品表现分析、季节性流量模式。' },
    4: { name: '药房', desc: '处方柜台排队监控、药剂师排班优化、咨询区追踪。' },
    5: { name: '超市', desc: '通道级流量热力图、收银台排队管理、自助结账采用追踪。' },
    6: { name: '奢侈品零售', desc: '面向高端零售的隐私优先人口统计洞察和VIP流量模式分析。' },
  },
}

const BLOG_TRANSLATIONS: Record<string, Record<number, { title: string; excerpt: string }>> = {
  ko: {
    1: { title: '피플 카운팅이 소매 매출을 25% 이상 올리는 방법', excerpt: '실시간 방문자 분석으로 소매업체가 레이아웃, 직원 배치, 마케팅 ROI를 최적화합니다.' },
    2: { title: '몰 테넌트 벤치마킹: CCTV AI로 공정한 트래픽 배분', excerpt: '쇼핑몰이 SmartCounter를 사용하여 테넌트 트래픽을 객관적으로 측정하는 방법.' },
    3: { title: '패션 리테일: AI로 피팅룸 전환율 추적', excerpt: 'AI 기반 분석이 패션 리테일에서 브라우징부터 피팅룸, 구매까지 전환율을 추적합니다.' },
    4: { title: '프라이버시 우선 인구통계 인사이트: CCTV AI가 알려주는 것', excerpt: 'CCTV AI가 개인정보를 저장하지 않고 가치 있는 인구통계 데이터를 제공하는 방법.' },
    5: { title: '계산대 대기 시간 단축: 실시간 대기열 관리', excerpt: 'AI 기반 대기열 감지로 계산대 대기 시간을 40-60% 단축합니다.' },
    6: { title: '안전 및 규정 준수를 위한 재실 인원 모니터링', excerpt: '실시간 재실 인원 모니터링으로 안전 규정 준수와 군중 관리를 AI 정확도로.' },
    9: { title: '오프라인 소매에서 전환율 이해하기', excerpt: '오프라인 매장의 전환율 의미, 측정 방법, 개선 전략.' },
    10: { title: '피플 카운팅 시스템이란? 소매업 완벽 가이드', excerpt: '피플 카운팅 시스템은 CCTV 카메라로 방문자를 자동 카운트하는 AI 기술입니다.' },
    11: { title: 'CCTV AI 피플 카운팅의 원리: 99.9% 정확도의 기술', excerpt: 'AI와 컴퓨터 비전이 일반 CCTV를 99.9% 정확도의 방문자 카운팅 시스템으로 바꿉니다.' },
    12: { title: '소매점 비지터 카운터의 혜택: 매출 40%까지 증가', excerpt: '비지터 카운터가 소매점의 직원 배치, 레이아웃, 프로모션을 최적화합니다.' },
    13: { title: 'CCTV AI 피플 카운팅 & 방문자 분석: 소매 완벽 솔루션', excerpt: 'CCTV AI가 보안 카메라를 강력한 방문자 분석 도구로 변환합니다.' },
  },
  ja: {
    1: { title: 'ピープルカウンティングで小売売上を25%以上向上させる方法', excerpt: 'リアルタイム来店分析で小売業者がレイアウト、人員配置、マーケティングROIを最適化。' },
    2: { title: 'モールテナントベンチマーク：CCTV AIで公正なトラフィック配分', excerpt: 'ショッピングモールがSmartCounterでテナントトラフィックを客観的に測定する方法。' },
    3: { title: 'ファッションリテール：AIでフィッティングルーム転換率を追跡', excerpt: 'AI分析がファッションリテールでブラウジングからフィッティングルーム、購入までの転換率を追跡。' },
    4: { title: 'プライバシーファーストの人口統計インサイト：CCTV AIでわかること', excerpt: 'CCTV AIが個人情報を保存せずに価値ある人口統計データを提供する方法。' },
    5: { title: 'レジ待ち時間短縮：リアルタイム待ち行列管理', excerpt: 'AI待ち行列検出でレジ待ち時間を40-60%短縮。' },
    6: { title: '安全・コンプライアンスのための在館人数モニタリング', excerpt: 'リアルタイム在館人数モニタリングで安全規制準拠と群衆管理をAI精度で。' },
    9: { title: '実店舗のコンバージョン率を理解する', excerpt: '実店舗のコンバージョン率の意味、測定方法、改善戦略。' },
    10: { title: 'ピープルカウンティングシステムとは？小売業完全ガイド', excerpt: 'ピープルカウンティングシステムはCCTVカメラで来店者を自動カウントするAI技術です。' },
    11: { title: 'CCTV AIピープルカウンティングの仕組み：99.9%精度の技術', excerpt: 'AIとコンピュータビジョンが普通のCCTVを99.9%精度の来店カウンティングシステムに変える。' },
    12: { title: '小売店ビジターカウンターのメリット：売上40%アップ', excerpt: 'ビジターカウンターが小売店の人員配置、レイアウト、プロモーションを最適化。' },
    13: { title: 'CCTV AIピープルカウンティング＆来店分析：小売完全ソリューション', excerpt: 'CCTV AIが防犯カメラを強力な来店分析ツールに変換。' },
  },
  zh: {
    1: { title: '客流量统计如何将零售销售额提升25%以上', excerpt: '实时访客分析帮助零售商优化布局、人员配置和营销投资回报率。' },
    2: { title: '商场租户基准测试：用CCTV AI公平分配客流', excerpt: '购物中心如何使用SmartCounter客观测量租户客流量。' },
    3: { title: '时装零售：AI追踪试衣间转化率', excerpt: 'AI分析追踪从浏览到试衣间再到购买的转化率。' },
    4: { title: '隐私优先的人口统计洞察：CCTV AI能告诉你什么', excerpt: 'CCTV AI如何在不存储个人信息的情况下提供有价值的人口统计数据。' },
    5: { title: '减少收银台等待时间：实时排队管理', excerpt: 'AI排队检测将收银台等待时间缩短40-60%。' },
    6: { title: '安全合规的在场人数监控', excerpt: '实时在场人数监控以AI精度确保安全合规和人群管理。' },
    9: { title: '理解实体零售的转化率', excerpt: '实体店转化率的含义、测量方法和改进策略。' },
    10: { title: '什么是客流量统计系统？零售业完整指南', excerpt: '客流量统计系统是通过CCTV摄像头自动统计访客的AI技术。' },
    11: { title: 'CCTV AI客流量统计的工作原理：99.9%准确率背后的技术', excerpt: 'AI和计算机视觉将普通CCTV变成99.9%准确率的访客统计系统。' },
    12: { title: '零售店访客计数器的优势：销售额提升可达40%', excerpt: '访客计数器帮助零售店优化人员配置、布局和促销活动。' },
    13: { title: 'CCTV AI客流量统计与访客分析：零售完整解决方案', excerpt: 'CCTV AI将安防摄像头变成强大的访客分析工具。' },
  },
}

export async function POST() {
  try {
    const payload = await getPayload({ config: configPromise })
    const results = { features: 0, useCases: 0, blogs: 0, errors: [] as string[] }

    for (const locale of ['ko', 'ja', 'zh']) {
      const featureData = FEATURE_NAMES[locale]
      for (const [idStr, data] of Object.entries(featureData)) {
        try {
          const enFeature = await payload.findByID({ collection: 'features', id: parseInt(idStr), locale: 'en' })
          await payload.update({
            collection: 'features',
            id: parseInt(idStr),
            locale,
            data: { name: data.name, slug: (enFeature as any).slug, shortDescription: data.desc },
          })
          results.features++
        } catch (err) {
          results.errors.push(`Feature ${locale}/${idStr}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      const ucData = USECASE_NAMES[locale]
      for (const [idStr, data] of Object.entries(ucData)) {
        try {
          const enUC = await payload.findByID({ collection: 'use-cases', id: parseInt(idStr), locale: 'en' })
          await payload.update({
            collection: 'use-cases',
            id: parseInt(idStr),
            locale,
            data: { industryName: data.name, slug: (enUC as any).slug, shortDescription: data.desc },
          })
          results.useCases++
        } catch (err) {
          results.errors.push(`UseCase ${locale}/${idStr}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }

      const blogData = BLOG_TRANSLATIONS[locale]
      for (const [idStr, data] of Object.entries(blogData)) {
        const blogId = parseInt(idStr)
        try {
          const enBlog = await payload.findByID({ collection: 'blog-posts', id: blogId, locale: 'en' })
          await payload.update({
            collection: 'blog-posts',
            id: blogId,
            locale,
            data: {
              title: data.title,
              slug: (enBlog as any).slug,
              excerpt: data.excerpt,
              content: lexical([data.excerpt]),
            },
          })
          results.blogs++
        } catch (err) {
          results.errors.push(`Blog ${locale}/${idStr}: ${err instanceof Error ? err.message : 'Unknown'}`)
        }
      }
    }

    return NextResponse.json({
      message: `Translated: ${results.features} features, ${results.useCases} use cases, ${results.blogs} blogs`,
      ...results,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed', message: error instanceof Error ? error.message : 'Unknown' }, { status: 500 })
  }
}
