import pandas as pd
from sklearn.preprocessing import MinMaxScaler

# 시설 프로파일 불러오기
facility_profile = pd.read_csv('../data/facility_profile.csv', index_col='시설명')

def get_recommendation(user_input):
    """
    user_input 예시:
    {
        'gender': 'female',   # female / male
        'age': '20',          # 20 / 30 / 40 / 50 / 60
        'lifestyle': 'culture', # culture / travel / outdoor / digital
        'visit_time': 'morning' # morning / afternoon / evening
    }
    """

    # 시설 프로파일 복사
    profile = facility_profile.copy()

    # 점수 계산용 빈 시리즈
    score = pd.Series(0.0, index=profile.index)

    # 성별 + 연령대 점수
    gender = '여' if user_input['gender'] == 'female' else '남'
    age = user_input['age']
    col = f'카드_{gender}_{age}대비율'
    if col in profile.columns:
        score += profile[col] * 30  # 30점 비중

    # 소득/소비 성향 점수
    score += profile['프리미엄소비성향'] * 0.05
    score += profile['문화이벤트관심점수'] * 0.05

    # 라이프스타일 점수
    lifestyle = user_input['lifestyle']
    if lifestyle == 'culture':
        score += profile['문화이벤트관심점수'] * 0.1
    elif lifestyle == 'travel':
        score += profile['해외여행관심점수'] * 0.1
    elif lifestyle == 'outdoor':
        score += profile['아웃도어관심점수'] * 0.1
    elif lifestyle == 'digital':
        score += profile['디지털성향점수'] * 0.1

    # 방문 시간대 점수
    time = user_input['visit_time']
    if time == 'morning':
        score += profile['시간_09_11비율'] * 20
    elif time == 'afternoon':
        score += profile['시간_14_18비율'] * 20
    elif time == 'evening':
        score += profile['시간_18시비율'] * 20

    # 0~100점으로 변환
    score_min = score.min()
    score_max = score.max()
    score_scaled = ((score - score_min) / (score_max - score_min) * 100).round(1)

    # 높은 점수 순으로 정렬
    result = score_scaled.sort_values(ascending=False).reset_index()
    result.columns = ['시설명', '점수']

    # 시설분류 붙이기
    facility_info = pd.read_csv('../data/seongsu_data.csv')[['시설명', '시설분류']].drop_duplicates()
    result = result.merge(facility_info, on='시설명')

    return result