'use client';

import { useMemo } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import Link from 'next/link';

import ImageWithEffect from '@/components/common/utilities/image-with-effect';
import GoToFullListIcon from '@/public/icons/my/go-to-full-list.svg';
import { fetchWishList } from '@/services/api/wish-controller';
import type { TargetSchema } from '@/types/wish-controller';

interface MyWishListProps {
  targetType: TargetSchema['targetType'];
  href: string;
}

export default function MyWishList({ targetType, href }: MyWishListProps) {
  const { data } = useSuspenseQuery({
    queryKey: [targetType === 'ARTIST' ? 'artistWishList' : 'itemWishList', targetType],
    queryFn: () => fetchWishList(targetType),
  });

  const displayData = useMemo(
    () => [
      { src: data[0]?.thumbnailUrl ?? null, isEnd: false },
      { src: data[1]?.thumbnailUrl ?? null, isEnd: false },
      { src: data[2]?.thumbnailUrl ?? null, isEnd: true },
    ],
    [data],
  );

  const isDisplay = useMemo(() => displayData[0].src || displayData[1].src || displayData[2].src, [displayData]);

  return (
    <div className="flex gap-1.75">
      {isDisplay ? (
        displayData.map(({ src, isEnd }, idx) =>
          src ? (
            <div key={idx} className="bg-green relative aspect-square flex-1 overflow-hidden rounded-xs">
              <ImageWithEffect src={src} alt={`아이템 ${data[idx].title} 이미지.`} fill />
              {isEnd && (
                <>
                  <div className="text-grey-1 text-body-02 bg-grey-3/50 absolute inset-0 z-5 flex h-full w-full flex-col items-center justify-center font-medium">
                    <p>{targetType === 'ARTIST' ? '북마크' : '위시'}</p>
                    <div className="flex items-center gap-1.5">
                      <p>전체 보기</p>
                      <GoToFullListIcon />
                    </div>
                  </div>
                  <Link href={href} className="absolute inset-0 z-10 h-full w-full" />
                </>
              )}
            </div>
          ) : (
            <div key={idx} className="aspect-square flex-1 bg-transparent"></div>
          ),
        )
      ) : (
        <div className="mx-1.75 flex aspect-[3/1] w-full flex-1 items-center justify-center">
          <p className="text-body-01 text-grey-5 font-medium">
            {targetType === 'ARTIST' ? '북마크한 아티스트가 없습니다' : '좋아요한 작품이 없습니다'}
          </p>
        </div>
      )}
    </div>
  );
}
