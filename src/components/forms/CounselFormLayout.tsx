'use client';

import '@/styles/base/form.scss'; // 공용 폼 스타일 import
import { FaChevronDown } from 'react-icons/fa';

export default function CounselFormLayout() {
    return (
        <form className="form">
            <div className="form-group">
                <label className="form-label">상담일시</label>
                <input type="datetime-local" className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label">통화시간</label>
                <input type="text" placeholder="00:03:21" className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label">고객명</label>
                <input type="text" className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label">연락처</label>
                <input type="tel" className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label">인입 분기</label>
                <input type="text" className="form-input" />
            </div>

            <div className="form-group">
                <label className="form-label">카테고리 선택</label>
                <div className="select-wrapper">
                    <select className="form-select">
                        <option>카테고리1</option>
                        <option>카테고리2</option>
                    </select>
                    <FaChevronDown className="select-icon" />
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">상담 내용</label>
                <textarea className="form-textarea" rows={4}></textarea>
            </div>
        </form>
    );
}