import { Destination } from '../../destination/destination.entity.js';
import dataSource from '../data-source.js';

const PROVINCES = [
  { code: 'an-giang', name: 'An Giang' },
  { code: 'bac-ninh', name: 'Bắc Ninh' },
  { code: 'ca-mau', name: 'Cà Mau' },
  { code: 'can-tho', name: 'Cần Thơ' },
  { code: 'cao-bang', name: 'Cao Bằng' },
  { code: 'da-nang', name: 'Đà Nẵng' },
  { code: 'dak-lak', name: 'Đắk Lắk' },
  { code: 'dien-bien', name: 'Điện Biên' },
  { code: 'dong-nai', name: 'Đồng Nai' },
  { code: 'dong-thap', name: 'Đồng Tháp' },
  { code: 'gia-lai', name: 'Gia Lai' },
  { code: 'ha-noi', name: 'Hà Nội' },
  { code: 'ha-tinh', name: 'Hà Tĩnh' },
  { code: 'hai-phong', name: 'Hải Phòng' },
  { code: 'ho-chi-minh', name: 'Hồ Chí Minh' },
  { code: 'hue', name: 'Huế' },
  { code: 'hung-yen', name: 'Hưng Yên' },
  { code: 'khanh-hoa', name: 'Khánh Hòa' },
  { code: 'lai-chau', name: 'Lai Châu' },
  { code: 'lam-dong', name: 'Lâm Đồng' },
  { code: 'lang-son', name: 'Lạng Sơn' },
  { code: 'lao-cai', name: 'Lào Cai' },
  { code: 'nghe-an', name: 'Nghệ An' },
  { code: 'ninh-binh', name: 'Ninh Bình' },
  { code: 'phu-tho', name: 'Phú Thọ' },
  { code: 'quang-ngai', name: 'Quảng Ngãi' },
  { code: 'quang-ninh', name: 'Quảng Ninh' },
  { code: 'quang-tri', name: 'Quảng Trị' },
  { code: 'son-la', name: 'Sơn La' },
  { code: 'tay-ninh', name: 'Tây Ninh' },
  { code: 'thai-nguyen', name: 'Thái Nguyên' },
  { code: 'thanh-hoa', name: 'Thanh Hoá' },
  { code: 'tuyen-quang', name: 'Tuyên Quang' },
  { code: 'vinh-long', name: 'Vĩnh Long' },
];

async function main() {
  await dataSource.initialize();

  try {
    const result = await dataSource
      .createQueryBuilder()
      .insert()
      .into(Destination)
      .values(PROVINCES)
      .orIgnore()
      .returning('id')
      .execute();

    console.log(
      `Seed destinations: create ${result.raw.length} new, sklip ${PROVINCES.length - result.raw.length}.`,
    );
  } finally {
    await dataSource.destroy();
  }
}

await main();

