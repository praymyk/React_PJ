'use client';

import { useMemo, useRef, useState } from 'react';
import styles from '@components/palace/test/category/DefaultContent.module.scss';
import HeaderSection from "@components/common/SubContentForm/headerSection/HeaderSection";

export type CategoryKind = 'consult' | 'reserve' | 'etc';
export type CategoryLevel = 1 | 2 | 3 | 4; // 대/중/소/세분류

export interface CategoryNode {
    id: number;
    dbId: number | null;

    kind: CategoryKind;
    level: CategoryLevel;
    name: string;

    parentId: number | null;
    sortOrder: number;
    active: boolean;
}

export type CategoryKindOption = {
    value: CategoryKind;
    label: string;
};

const LEVEL_LABEL: Record<CategoryLevel, string> = {
    1: '1차 카테고리',
    2: '2차 카테고리',
    3: '3차 카테고리',
    4: '4차 카테고리',
};

type DefaultContentProps = {
    companyId: number;
    kindOptions: CategoryKindOption[];
    initialNodes: CategoryNode[];
    initialSelectedKind?: CategoryKind;
};

export default function DefaultContent({
                                           companyId,
                                           kindOptions,
                                           initialNodes,
                                           initialSelectedKind,
                                       }: DefaultContentProps) {
    const [selectedKind, setSelectedKind] = useState<CategoryKind>(
        initialSelectedKind ?? (kindOptions[0]?.value ?? 'consult'),
    );

    const [nodes, setNodes] = useState<CategoryNode[]>(initialNodes);

    // 각 단계별 선택된 ID (1~4단계)
    const [selectedIds, setSelectedIds] = useState<
        Partial<Record<CategoryLevel, number>>
    >({});

    // 새 ID 용 카운터
    const idCounterRef = useRef<number>(1000);
    const getNextId = () => {
        idCounterRef.current += 1;
        return idCounterRef.current;
    };

    /** level + 부모 선택 상태에 따라 해당 컬럼에 보여줄 노드들 */
    const getLevelNodes = (level: CategoryLevel): CategoryNode[] => {
        const parentId: number | null =
            level === 1 ? null : selectedIds[(level - 1) as CategoryLevel] ?? null;

        return nodes
            .filter(
                (n) =>
                    n.kind === selectedKind &&
                    n.level === level &&
                    n.parentId === parentId,
            )
            .sort((a, b) => a.sortOrder - b.sortOrder);
    };

    /** 같은 parent / level 내에서 다음 sortOrder 구하기 */
    const getNextSortOrder = (
        kind: CategoryKind,
        parentId: number | null,
        level: CategoryLevel,
    ) => {
        const siblings = nodes.filter(
            (n) => n.kind === kind && n.parentId === parentId && n.level === level,
        );
        if (siblings.length === 0) return 1;
        return Math.max(...siblings.map((s) => s.sortOrder)) + 1;
    };

    /** 특정 단계에 추가 */
    const handleAddAtLevel = (level: CategoryLevel) => {
        const label = LEVEL_LABEL[level];
        let parentId: number | null = null;

        if (level === 1) {
            parentId = null;
        } else {
            const parentLevel = (level - 1) as CategoryLevel;
            const parentSelectedId = selectedIds[parentLevel];
            if (parentSelectedId === undefined || parentSelectedId === null) {
                alert(`${LEVEL_LABEL[parentLevel]}를 먼저 선택해 주세요.`);
                return;
            }
            parentId = parentSelectedId;
        }

        const name = window.prompt(`${label} 이름을 입력하세요.`, `새 ${label}`);
        if (!name) return;

        const newNode: CategoryNode = {
            id: getNextId(),
            dbId: null,
            kind: selectedKind,
            level,
            parentId,
            name: name.trim(),
            sortOrder: getNextSortOrder(selectedKind, parentId, level),
            active: true,
        };

        setNodes((prev) => [...prev, newNode]);

        // 방금 추가한 항목을 해당 단계 선택 + 하위 단계는 초기화
        setSelectedIds((prev) => {
            const next: Partial<Record<CategoryLevel, number>> = {
                ...prev,
                [level]: newNode.id,
            };
            for (
                let l = (level + 1) as CategoryLevel;
                l <= 4;
                l = (l + 1) as CategoryLevel
            ) {
                delete (next as any)[l];
            }
            return next;
        });
    };

    /** 노드 선택 */
    const handleSelectNode = (node: CategoryNode) => {
        setSelectedIds((prev) => {
            const next: Partial<Record<CategoryLevel, number>> = {
                ...prev,
                [node.level]: node.id,
            };
            for (
                let l = (node.level + 1) as CategoryLevel;
                l <= 4;
                l = (l + 1) as CategoryLevel
            ) {
                delete (next as any)[l];
            }
            return next;
        });
    };

    /** 이름 변경 */
    const handleRename = (node: CategoryNode) => {
        const name = window.prompt(`${LEVEL_LABEL[node.level]} 이름 변경`, node.name);
        if (!name) return;

        setNodes((prev) =>
            prev.map((n) => (n.id === node.id ? { ...n, name: name.trim() } : n)),
        );
    };

    /** 순서 위로/아래로 (siblings 내 sortOrder swap) */
    const moveNode = (target: CategoryNode, direction: 'up' | 'down') => {
        const siblings = nodes.filter(
            (n) =>
                n.level === target.level &&
                n.parentId === target.parentId &&
                n.kind === target.kind,
        );

        const sortedSiblings = [...siblings].sort(
            (a, b) => a.sortOrder - b.sortOrder,
        );
        const idx = sortedSiblings.findIndex((s) => s.id === target.id);
        if (idx === -1) return;

        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === sortedSiblings.length - 1) return;

        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        const a = sortedSiblings[idx];
        const b = sortedSiblings[swapIdx];

        setNodes((prev) =>
            prev.map((n) => {
                if (n.id === a.id) return { ...n, sortOrder: b.sortOrder };
                if (n.id === b.id) return { ...n, sortOrder: a.sortOrder };
                return n;
            }),
        );
    };

    /** 하위까지 포함해서 삭제 */
    const handleDelete = (node: CategoryNode) => {
        const ok = window.confirm(
            `"${node.name}" 및 하위 분류를 모두 삭제하시겠습니까?`,
        );
        if (!ok) return;

        const collectDescendants = (id: number, all: CategoryNode[]): Set<number> => {
            const result = new Set<number>();
            const stack: number[] = [id];

            while (stack.length) {
                const currentId = stack.pop()!;
                result.add(currentId);
                const children = all.filter((n) => n.parentId === currentId);
                children.forEach((c) => stack.push(c.id));
            }
            return result;
        };

        const idsToRemove = collectDescendants(node.id, nodes);
        setNodes((prev) => prev.filter((n) => !idsToRemove.has(n.id)));

        // 선택 상태도 정리
        setSelectedIds((prev) => {
            const next: Partial<Record<CategoryLevel, number>> = { ...prev };
            ( [1, 2, 3, 4] as CategoryLevel[] ).forEach((level) => {
                const id = next[level];
                if (id === undefined || id === null) return;
                if (idsToRemove.has(id)) {
                    delete next[level];
                }
            });
            return next;
        });
    };

    /** 선택된 경로 (breadcrumb 용) */
    const selectedPathNodes = useMemo(() => {
        const result: CategoryNode[] = [];
        ( [1, 2, 3, 4] as CategoryLevel[] ).forEach((level) => {
            const id = selectedIds[level];
            if (id === undefined || id === null) return;
            const node = nodes.find(
                (n) => n.id === id && n.kind === selectedKind,
            );
            if (node) result.push(node);
        });
        return result;
    }, [nodes, selectedIds, selectedKind]);

    const lastSelectedNode =
        selectedPathNodes[selectedPathNodes.length - 1] ?? null;

    /** 저장 버튼 클릭 - 나중에 API 연동 자리 */
    const handleSave = async () => {
        try {
            const targetNodes = nodes.filter(
                (n) => n.kind === selectedKind,
            );

            const payload = {
                companyId,
                kind: selectedKind,
                nodes: targetNodes.map((n) => ({
                    id: n.dbId,             // DB PK, 신규면 null
                    clientId: n.id,         // 프론트 전용 ID
                    parentClientId: n.parentId, // 부모 프론트 ID
                    level: n.level,
                    name: n.name,
                    sortOrder: n.sortOrder,
                    active: n.active,
                })),
            };

            const res = await fetch('/api/common/categories/tree', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                throw new Error('저장 실패');
            }

            alert('저장 완료');
        } catch (err) {
            console.error(err);
            alert('저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className={styles.root}>

            <HeaderSection
                title="카테고리 관리"
                description="상담 / 예약 등 카테고리 종류별로 1~4차 분류 구조와 순서를 관리합니다."
            />

            <header className={styles.header}>

                <div className={styles.headerRight}>
                    <select
                        className={styles.kindSelect}
                        value={selectedKind}
                        onChange={(e) => {
                            const kind = e.target.value as CategoryKind;
                            setSelectedKind(kind);
                            setSelectedIds({});
                        }}
                    >
                        {kindOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        className={styles.primaryButton}
                        onClick={handleSave}
                    >
                        변경사항 저장
                    </button>
                </div>
            </header>

            <section className={styles.toolbar}>
                <div>
                    <span className={styles.badgeLabel}>현재 선택</span>
                    <span className={styles.badgeValue}>
                        {
                            kindOptions.find((opt) => opt.value === selectedKind)?.label ??
                            '카테고리 미선택'
                        }
                    </span>
                </div>

                <div className={styles.toolbarRight}>
                    <button
                        type="button"
                        className={styles.secondaryButton}
                        onClick={() => handleAddAtLevel(1)}
                    >
                        + 1차 카테고리 추가
                    </button>
                </div>
            </section>

            {/* 4단계 컬럼 UI */}
            <section className={styles.body}>
                <div className={styles.columnHeaderRow}>
                    <div className={styles.columnHeaderCell}>1차</div>
                    <div className={styles.columnHeaderCell}>2차</div>
                    <div className={styles.columnHeaderCell}>3차</div>
                    <div className={styles.columnHeaderCell}>4차</div>
                </div>

                <div className={styles.columns}>
                    {( [1, 2, 3, 4] as CategoryLevel[] ).map((level) => {
                        const items = getLevelNodes(level);
                        const selectedId = selectedIds[level];
                        const canAdd =
                            level === 1 ||
                            !!selectedIds[(level - 1) as CategoryLevel];

                        return (
                            <div key={level} className={styles.column}>
                                <div className={styles.columnTop}>
                                    <span className={styles.columnTitle}>
                                        {LEVEL_LABEL[level]}
                                    </span>
                                    <button
                                        type="button"
                                        className={styles.columnAddButton}
                                        onClick={() => handleAddAtLevel(level)}
                                        disabled={!canAdd}
                                    >
                                        + 추가
                                    </button>
                                </div>
                                <div className={styles.columnList}>
                                    {items.length === 0 && (
                                        <div className={styles.emptyColumnText}>
                                            항목 없음
                                        </div>
                                    )}
                                    {items.map((node) => {
                                        const isSelected = node.id === selectedId;
                                        const itemClassNames = [
                                            styles.item,
                                            !node.active
                                                ? styles.itemInactive
                                                : '',
                                            isSelected
                                                ? styles.itemSelected
                                                : '',
                                        ]
                                            .filter(Boolean)
                                            .join(' ');
                                        return (
                                            <button
                                                key={node.id}
                                                type="button"
                                                className={itemClassNames}
                                                onClick={() => handleSelectNode(node)}
                                            >
                                                <span className={styles.itemName}>
                                                    {node.name}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className={styles.bottomArea}>
                    <div className={styles.selectedPathBox}>
                        {selectedPathNodes.length === 0 ? (
                            <span className={styles.selectedPathEmpty}>
                                선택된 카테고리가 없습니다. 왼쪽부터 순서대로 선택해 주세요.
                            </span>
                        ) : (
                            <>
                                {selectedPathNodes.map((node, idx) => (
                                    <span
                                        key={node.id}
                                        className={styles.breadcrumbItem}
                                    >
                                        {idx > 0 && (
                                            <span
                                                className={
                                                    styles.breadcrumbSeparator
                                                }
                                            >
                                                {'>'}
                                            </span>
                                        )}
                                        <span
                                            className={styles.breadcrumbLabel}
                                        >
                                            {node.name}
                                        </span>
                                    </span>
                                ))}
                            </>
                        )}
                    </div>

                    <div className={styles.bottomActions}>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => {
                                if (!lastSelectedNode) return;
                                handleRename(lastSelectedNode);
                            }}
                            disabled={!lastSelectedNode}
                        >
                            이름 변경
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => {
                                if (!lastSelectedNode) return;
                                moveNode(lastSelectedNode, 'up');
                            }}
                            disabled={!lastSelectedNode}
                        >
                            위로
                        </button>
                        <button
                            type="button"
                            className={styles.secondaryButton}
                            onClick={() => {
                                if (!lastSelectedNode) return;
                                moveNode(lastSelectedNode, 'down');
                            }}
                            disabled={!lastSelectedNode}
                        >
                            아래로
                        </button>
                        <button
                            type="button"
                            className={styles.iconButtonDanger}
                            onClick={() => {
                                if (!lastSelectedNode) return;
                                handleDelete(lastSelectedNode);
                            }}
                            disabled={!lastSelectedNode}
                        >
                            선택 분류 삭제
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}