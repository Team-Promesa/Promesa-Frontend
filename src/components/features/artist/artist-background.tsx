'use client';

import { useSuspenseQuery } from '@tanstack/react-query';

import ImageWithEffect from '@/components/common/utilities/image-with-effect';
import { useToggleWish } from '@/hooks/use-toggle-wish';
import BookmarkEmptyIcon from '@/public/icons/artist/bookmark-empty.svg';
import BookmarkFilledIcon from '@/public/icons/artist/bookmark-filled.svg';
import { fetchArtist } from '@/services/api/artist-controller';

interface ArtistBackgroundDivProps {
  artistId: number;
}

export default function ArtistBackground({ artistId }: ArtistBackgroundDivProps) {
  const { data } = useSuspenseQuery({
    queryKey: ['artist', artistId],
    queryFn: () => fetchArtist(artistId),
    refetchOnMount: 'always',
  });

  const { mutate: toggleWish } = useToggleWish();

  const { profile, wish } = data;

  const { name, profileImageUrl } = profile;
  const { isWishlisted, wishCount } = wish;

  return (
    <div className="fixed-component no-z-index top-11.5 h-50 w-full">
      <ImageWithEffect src={profileImageUrl} alt={`프로메사 ${name} 작가 페이지의 배경 이미지.`} fill priority />
      <div className="text-grey-0 absolute top-4 right-3.5 z-10 flex flex-col gap-0.5">
        <button
          onClick={() => toggleWish({ targetType: 'ARTIST', targetId: artistId, currentWished: isWishlisted })}
          className="cursor-pointer"
        >
          {isWishlisted ? <BookmarkFilledIcon /> : <BookmarkEmptyIcon />}
        </button>
        {wishCount >= 0 && <p className="text-body-02 font-regular text-center">{wishCount}</p>}
      </div>
    </div>
  );
}
